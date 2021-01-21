using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace Viewer.Web.Utilities
{
    public class IdentityGenerator
    {
        private int _i;

        public IdentityGenerator(IOptionsMonitor<IdentityGeneratorOptions> generatorOptions)
        {
            GeneratorOptions = generatorOptions.CurrentValue;
            if (GeneratorOptions.InstanceTag > 31 || GeneratorOptions.InstanceTag < 0)
            {
                throw new ArgumentOutOfRangeException();
            }
        }

        public IdentityGeneratorOptions GeneratorOptions { get; }

        public Task<long> GenerateAsync()
        {
            var ticks = DateTime.UtcNow.Ticks & 0xFFFFFFFF;
            Interlocked.CompareExchange(ref _i, -1, ushort.MaxValue);
            var seq = Interlocked.Increment(ref _i);
            // 5bit + 16bit + 32bit
            var value = ((long)GeneratorOptions.InstanceTag << 48) + ((long)seq << 32) + ticks;
            return Task.FromResult(value);
        }
    }
}