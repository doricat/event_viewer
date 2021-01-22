INSERT INTO files (id, filename, content_type, size, raw_name, stream)
VALUES (281524743956263, '.', 'image/png', 565, 'EEF8CE82C9BD4D5DC02A35A1F29F126A.jpg',
        E'\\x89504E470D0A1A0A0000000D49484452000000B4000000B408060000003DCD0632000001FC49444154789CEDD2C109C02000C0C0DAA1C4A7FB2F65972808E16E823C32E6DAE78188F77600FCC9D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A1443936268520C4D8AA1493134298626C5D0A4189A940F3ACE031534052FC20000000049454E44AE426082');
INSERT INTO users (id, user_name, normalized_user_name, email, normalized_email, email_confirmed, password_hash,
                   security_stamp, concurrency_stamp, phone_number, phone_number_confirmed, two_factor_enabled, lockout_end,
                   lockout_enabled, access_failed_count, avatar_id, name)
VALUES (281548339773343, '123qwe@123qwe.com', '123QWE@123QWE.COM', '123qwe@123qwe.com', '123QWE@123QWE.COM', false,
        'AQAAAAEAACcQAAAAEFPOf0veHrmHFo860fl4DpDpLmoeNg4bj/Vc5fHlVmYM4sxLHVdN0DDRwNysfRw4Gw==',
        'DR2GIWLXABVZL5WW4TY7WH6YBUR5OFU3', '46ad6187-0a06-4541-acc4-445e4c038455', null, false, false, null, true, 0,
        281524743956263, '123qwe');
INSERT INTO roles (id, name, normalized_name, concurrency_stamp)
VALUES (288664624012977, 'admin', 'ADMIN', null);
INSERT INTO user_roles (user_id, role_id)
VALUES (281548339773343, 288664624012977);
INSERT INTO applications (id, application_id, name, description, enabled)
VALUES (281482820257685, 'event_viewer', '事件查看器', '', true);
INSERT INTO user_applications (user_id, application_id)
VALUES (281548339773343, 281482820257685);