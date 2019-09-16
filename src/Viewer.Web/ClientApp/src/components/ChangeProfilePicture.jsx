import React from 'react';
import { Image, DropdownButton, Dropdown } from 'react-bootstrap';

export default () => (
    <>
        <div>
            <Image src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22171%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20171%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_16cb7752f0e%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_16cb7752f0e%22%3E%3Crect%20width%3D%22171%22%20height%3D%22180%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2259.90833282470703%22%20y%3D%2294.40000009536743%22%3E171x180%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" rounded />
            <DropdownButton title="编辑" variant="dark" size="sm" style={{ position: "absolute", marginLeft: "25px", marginTop: "165px", left: "0px", top: "0px" }}>
                <Dropdown.Item as="button">上传照片</Dropdown.Item>
                <Dropdown.Item as="button">移除照片</Dropdown.Item>
            </DropdownButton>
        </div>
    </>
);