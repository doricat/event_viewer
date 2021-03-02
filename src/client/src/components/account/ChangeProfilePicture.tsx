import React, { useContext, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import { Image, DropdownButton, Dropdown } from 'react-bootstrap';
import { StoreContext } from '../../stores';

export const ChangeProfilePicture = observer(() => {
    const context = useContext(StoreContext);
    const fileInput = useRef<HTMLInputElement>(null);
    const [traceId, setTraceId] = useState(-1);
    const avatar = context.account.profile.avatar;

    const replace = (element: React.ChangeEvent<HTMLInputElement>) => {
        if (element.target.files) {
            setTraceId(context.account.changeAvatar(element.target.files[0]));
        }
    };

    const remove = () => {
        setTraceId(context.account.removeAvatar());
    };

    const state = context.ui.requestStates.get(traceId);

    return (
        <>
            <div>
                <Image src={avatar} rounded />
                <DropdownButton title="编辑" variant="dark" size="sm" style={{ position: "relative", left: "10px", top: "-40px", display: avatar === "" ? "none" : "block" }}>
                    <Dropdown.Item as="button" onClick={() => fileInput?.current?.click()} disabled={state?.waiting}>上传照片</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={() => remove()} disabled={state?.waiting}>移除照片</Dropdown.Item>
                </DropdownButton>
            </div>

            <form style={{ display: "none" }}>
                <input type="file" ref={fileInput} accept=".jpg" onChange={(x) => replace(x)} />
            </form>
        </>
    );
});
