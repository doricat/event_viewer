using Viewer.Web.Data.Entities;

namespace Viewer.Web.ViewModels.Account
{
    public class AccountGetOutputModel
    {
        public long Id { get; set; }

        public string Email { get; set; }

        public string Name { get; set; }

        public string Avatar { get; set; }

        public static AccountGetOutputModel FromUser(User user)
        {
            return new AccountGetOutputModel
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Avatar = $"/api/files/{user.AvatarId}"
            };
        }
    }
}