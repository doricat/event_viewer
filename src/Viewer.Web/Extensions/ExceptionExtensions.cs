using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Viewer.Web.Extensions
{
    public static class ExceptionExtensions
    {
        public static string SerializeToJson(this Exception e)
        {
            var jObject = JObject.FromObject(e,
                JsonSerializer.CreateDefault(new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }));
            if (e is AggregateException)
            {
                jObject.Remove("InnerException");
                var exceptions = jObject["InnerExceptions"];
                if (exceptions != null && exceptions.HasValues)
                {
                    var token = exceptions.First;
                    if (token != null)
                    {
                        do
                        {
                            var stackTraces = ParseStackTrace(token);
                            if (stackTraces.Any())
                            {
                                var array = new JArray();
                                foreach (var stackTrace in stackTraces)
                                {
                                    array.Add(JObject.FromObject(stackTrace));
                                }

                                token["StackTraceString"] = null;
                                token["StackTrace"] = array;
                            }

                            token = token.Next;
                        } while (token != null && token != exceptions.Last);
                    }
                }
            }

            {
                var stackTraces = ParseStackTrace(jObject);
                if (stackTraces.Any())
                {
                    jObject.Remove("StackTraceString");
                    var array = new JArray();
                    foreach (var stackTrace in stackTraces)
                    {
                        array.Add(JObject.FromObject(stackTrace));
                    }

                    jObject.Add("StackTrace", array);
                }
            }

            return jObject.ToString(Formatting.None);
        }

        private static IList<StackTraceModel> ParseStackTrace(JToken jToken)
        {
            IList<StackTraceModel> result = null;
            do
            {
                var token = jToken["StackTraceString"];
                if (token == null)
                {
                    break;
                }

                if (token.Type != JTokenType.String)
                {
                    break;
                }

                var stackTraceString = token.Value<string>();
                if (string.IsNullOrWhiteSpace(stackTraceString))
                {
                    break;
                }

                result = BuildStackTraces(stackTraceString);
            } while (false);

            return result ?? new List<StackTraceModel>(0);
        }

        private static IList<StackTraceModel> ParseStackTrace(JObject jObject)
        {
            IList<StackTraceModel> result = null;
            do
            {
                if (!jObject.ContainsKey("StackTraceString"))
                {
                    break;
                }

                var token = jObject["StackTraceString"];
                if (token == null)
                {
                    break;
                }

                if (token.Type != JTokenType.String)
                {
                    break;
                }

                var stackTraceString = token.Value<string>();
                if (string.IsNullOrWhiteSpace(stackTraceString))
                {
                    break;
                }

                result = BuildStackTraces(stackTraceString);
            } while (false);

            return result ?? new List<StackTraceModel>(0);
        }

        private static IList<StackTraceModel> BuildStackTraces(string stackTraceString)
        {
            var result = new List<StackTraceModel>();
            var lines = GetLines(stackTraceString);
            foreach (var line in lines)
            {
                var stackTrace = new StackTraceModel();
                var (method, fileInfo) = ParseMethodAndFileInfo(line);
                stackTrace.Method = method;

                if (!string.IsNullOrWhiteSpace(fileInfo))
                {
                    var (file, lineNo) = ParseFileAndLineNo(fileInfo);
                    stackTrace.File = file;
                    stackTrace.Line = lineNo;
                }

                result.Add(stackTrace);
            }

            return result;
        }

        private static IList<string> GetLines(string stackTraceString)
        {
            var list = Regex.Split(stackTraceString, @"(\r\n|\n)").Where(x => !string.IsNullOrWhiteSpace(x)).Select(x => x.Trim()).ToList();
            return list;
        }

        private static Tuple<string, string> ParseMethodAndFileInfo(string line)
        {
            string method = null;
            string file = null;

            var list = Regex.Split(line, @"\sin\s").Where(x => !string.IsNullOrWhiteSpace(x)).ToList();
            if (list.Count > 0)
            {
                var first = list.First();
                if (first.StartsWith("at"))
                {
                    method = first.Substring(3);
                }
                else if (first.StartsWith("在"))
                {
                    method = first.Substring(2);
                }
                else
                {
                    method = first;
                }
            }

            if (list.Count > 1)
            {
                file = list[1];
            }

            return new Tuple<string, string>(method, file);
        }

        private static Tuple<string, int?> ParseFileAndLineNo(string fileInfo)
        {
            string file = null;
            int? line = null;
            var list = Regex.Split(fileInfo, @":line\s").Where(x => !string.IsNullOrWhiteSpace(x)).ToList();
            if (list.Count > 0)
            {
                file = list.First();
            }

            if (list.Count > 1 && int.TryParse(list[1], out var i))
            {
                line = i;
            }

            return new Tuple<string, int?>(file, line);
        }
    }

    public class StackTraceModel
    {
        public string Method { get; set; }

        public string File { get; set; }

        public int? Line { get; set; }
    }
}