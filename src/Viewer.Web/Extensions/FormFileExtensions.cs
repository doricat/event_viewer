using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;

namespace Viewer.Web.Extensions
{
    public static class FormFileExtensions
    {
        public static readonly IReadOnlyCollection<string> ContentTypes = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "image/jpeg", "image/png", "image/jpg"
        };

        public static async Task<Stream> ResizeFile(this IFormFile file, int width)
        {
            if (!ContentTypes.Contains(file.ContentType))
            {
                throw new NotSupportedException();
            }

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                var imageStream = new MemoryStream();
                stream.Seek(0, SeekOrigin.Begin);
                using (var image = Image.Load(stream))
                {
                    if (image.Width < image.Height)
                    {
                        var times = (decimal)image.Height / image.Width;
                        image.Mutate(x => x.Resize(width, (int)(width * times)));
                    }
                    else
                    {
                        var times = (decimal)image.Width / image.Height;
                        image.Mutate(x => x.Resize((int)(width * times), width));
                    }

                    image.Mutate(x => x.Crop(new Rectangle(0, 0, width, width)));

                    switch (file.ContentType.ToLower())
                    {
                        case "image/jpeg":
                        case "image/jpg":
                            image.Save(imageStream, new JpegEncoder());
                            break;

                        case "image/png":
                            image.Save(imageStream, new PngEncoder());
                            break;

                        default:
                            throw new ArgumentOutOfRangeException();
                    }
                }

                return imageStream;
            }
        }
    }
}