INSERT INTO event_viewer.dbo.AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnd, LockoutEnabled, AccessFailedCount, Avatar, Name) VALUES (281548339773343, '123qwe@123qwe.com', '123QWE@123QWE.COM', '123qwe@123qwe.com', '123QWE@123QWE.COM', 0, 'AQAAAAEAACcQAAAAEFPOf0veHrmHFo860fl4DpDpLmoeNg4bj/Vc5fHlVmYM4sxLHVdN0DDRwNysfRw4Gw==', 'DR2GIWLXABVZL5WW4TY7WH6YBUR5OFU3', '46ad6187-0a06-4541-acc4-445e4c038455', null, 0, 0, null, 1, 0, '/api/images/281524743956263', '123qwe');
INSERT INTO event_viewer.dbo.AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp) VALUES (288664624012977, 'admin', 'ADMIN', null);
INSERT INTO event_viewer.dbo.AspNetUserRoles (UserId, RoleId) VALUES (281548339773343, 288664624012977);
INSERT INTO event_viewer.dbo.Applications (Id, ApplicationId, Name, Description, Enabled) VALUES (281482820257685, 'event_viewer', '事件查看器', '', 1);
INSERT INTO event_viewer.dbo.UserApplication (UserId, ApplicationId) VALUES (281548339773343, 281482820257685);
INSERT INTO event_viewer.dbo.Files (Id, Filename, ContentType, Size, RawName, Stream) VALUES (281524743956263, '.', 'image/png', 565, 'EEF8CE82C9BD4D5DC02A35A1F29F126A.jpg', 0x89504E470D0A1A0A0000000D49484452000000B4000000B408060000003DCD0632000001FC49444154789CEDD2C109C02000C0C0DAA1C4A7FB2F65972808E16E823C32E6DAE78188F77600FCC9D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A940F3ACE031534052FC20000000049454E44AE426082);