using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Viewer.Web.Migrations
{
    public partial class AddFileStreamProp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "Stream",
                table: "Files",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Stream",
                table: "Files");
        }
    }
}
