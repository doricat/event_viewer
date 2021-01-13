using Viewer.Web.Data.Entities;

namespace Viewer.Web.Controllers.Account
{
    public class UserProfilesOutputModel
    {
        public string Name { get; set; }

        public string Avatar { get; set; }

        public static UserProfilesOutputModel FromUser(User user)
        {
            return new UserProfilesOutputModel
            {
                Name = user.Name,
                Avatar = $"/api/files/{user.AvatarId}"
            };
        }
    }
}