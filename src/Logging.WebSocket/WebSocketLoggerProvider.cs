using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Logging.WebSocket
{
    public class WebSocketLoggerProvider : ILoggerProvider
    {
        private readonly List<LogMessage> _currentBatch = new List<LogMessage>();
        private readonly TimeSpan _interval;
        private readonly int? _queueSize;
        private readonly int? _batchSize;
        private readonly IDisposable _optionsChangeToken;

        private int _messageDropped;

        private BlockingCollection<LogMessage> _messageQueue;
        private Task _outputTask;
        private CancellationTokenSource _cancellationTokenSource;

        private readonly HubConnection _connection;
        private readonly WebSocketLoggerOptions _loggerOptions;

        private readonly int _processId;

        public WebSocketLoggerProvider(IOptionsMonitor<WebSocketLoggerOptions> options)
        {
            _loggerOptions = options.CurrentValue;
            var exceptions = _loggerOptions.Validate();
            if (exceptions.Any())
            {
                throw new AggregateException(exceptions);
            }

            _interval = _loggerOptions.FlushPeriod;
            _batchSize = _loggerOptions.BatchSize;
            _queueSize = _loggerOptions.BackgroundQueueSize;

            _connection = new HubConnectionBuilder().WithUrl(_loggerOptions.Url).Build();
            _connection.Closed += async error =>
            {
                await Task.Delay(new Random().Next(0, 5) * 1000);
                await _connection.StartAsync();
            };

            _processId = Process.GetCurrentProcess().Id;

            _optionsChangeToken = options.OnChange(UpdateOptions);
            UpdateOptions(options.CurrentValue);
        }

        public bool IsEnabled { get; protected set; }

        public void Dispose()
        {
            _optionsChangeToken?.Dispose();
            if (IsEnabled)
            {
                Stop();
            }
        }

        public ILogger CreateLogger(string categoryName)
        {
            return new WebSocketLogger(this, categoryName);
        }

        internal void AddMessage(LogMessage messages)
        {
            if (!_messageQueue.IsAddingCompleted)
            {
                try
                {
                    messages.ProcessId = _processId;
                    if (!_messageQueue.TryAdd(messages, 0, _cancellationTokenSource.Token))
                    {
                        Interlocked.Increment(ref _messageDropped);
                    }
                }
                catch
                {
                    // ignored
                }
            }
        }

        protected async Task WriteMessageAsync(IList<LogMessage> messages, CancellationToken token)
        {
            foreach (var message in messages)
            {
                await _connection.SendAsync(_loggerOptions.MethodName, message, token);
            }
        }

        protected virtual Task IntervalAsync(TimeSpan interval, CancellationToken token)
        {
            return Task.Delay(interval, token);
        }

        private async Task ProcessLogQueue(object state)
        {
            while (!_cancellationTokenSource.IsCancellationRequested)
            {
                var limit = _batchSize ?? int.MaxValue;
                while (limit > 0 && _messageQueue.TryTake(out var message))
                {
                    _currentBatch.Add(message);
                    limit--;
                }

                var messagesDropped = Interlocked.Exchange(ref _messageDropped, 0);
                if (messagesDropped != 0)
                {
                    _currentBatch.Add(new LogMessage());
                }

                if (_currentBatch.Count > 0)
                {
                    try
                    {
                        await WriteMessageAsync(_currentBatch, _cancellationTokenSource.Token);
                    }
                    catch
                    {
                        // ignored
                    }

                    _currentBatch.Clear();
                }

                await IntervalAsync(_interval, _cancellationTokenSource.Token);
            }
        }

        private void Start()
        {
            _messageQueue = _queueSize == null
                ? new BlockingCollection<LogMessage>(new ConcurrentQueue<LogMessage>())
                : new BlockingCollection<LogMessage>(new ConcurrentQueue<LogMessage>(), _queueSize.Value);

            _cancellationTokenSource = new CancellationTokenSource();
            _outputTask = Task.Factory.StartNew(ProcessLogQueue, null, TaskCreationOptions.LongRunning);
        }

        private void Stop()
        {
            _cancellationTokenSource.Cancel();
            _messageQueue.CompleteAdding();

            try
            {
                _outputTask.Wait(_interval);
                _connection.DisposeAsync();
            }
            catch (TaskCanceledException)
            {
                // ignored
            }
            catch (AggregateException ex) when (ex.InnerExceptions.Count == 1 && ex.InnerExceptions[0] is TaskCanceledException)
            {
                // ignored
            }
        }

        private void UpdateOptions(WebSocketLoggerOptions options)
        {
            var oldIsEnabled = IsEnabled;
            IsEnabled = options.IsEnabled;
            if (oldIsEnabled != IsEnabled)
            {
                if (IsEnabled)
                {
                    Start();
                }
                else
                {
                    Stop();
                }
            }
        }
    }
}