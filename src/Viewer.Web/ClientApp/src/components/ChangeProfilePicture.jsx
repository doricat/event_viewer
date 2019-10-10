import React from 'react';
import { Image, DropdownButton, Dropdown } from 'react-bootstrap';
import authorizeService from '../services/AuthorizeService';
import { actions as uiActions } from '../store/ui';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import ApiResultAlert from './ApiResultAlert';

class ChangeProfilePicture extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: false,
            apiResult: null,
            localSuccessMessage: undefined
        };

        this.fileInput = React.createRef();
    }

    openDialog() {
        this.fileInput.current.click();
    }

    async uploadAvatar(evt) {
        this.setState({ apiResult: null, localSuccessMessage: undefined });
        const file = evt.currentTarget.files[0];

        const formData = new FormData();
        formData.append("file", file);

        const token = await authorizeService.getAccessToken();
        const response = await fetch("/api/accounts/current/profiles/avatar", {
            method: "PATCH",
            headers: !token ? {} : { "Authorization": `Bearer ${token}` },
            body: formData
        });

        await this.handleFetchResult(response);
    }

    async removeAvatar() {
        this.setState({ apiResult: null, localSuccessMessage: undefined });
        const token = await authorizeService.getAccessToken();
        const response = await fetch("/api/accounts/current/profiles/avatar", {
            method: "DELETE",
            headers: !token ? {} : { "Authorization": `Bearer ${token}` }
        });

        await this.handleFetchResult(response);
    }

    async handleFetchResult(response) {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.startsWith("application/json")) {
            const json = await response.json();

            if (response.status >= 400 && response.status < 500) {
                this.setState({
                    apiResult: json
                });
                return;
            }

            if (response.status === 500) {
                this.props.setGlobalError(json.error.message);
                return;
            }

            console.error(json);
        } else {
            if (response.ok === true) {
                this.setState({
                    localSuccessMessage: "操作成功！"
                });
                this.props.reloadProfiles();
                return;
            }

            if (response.status === 401) {
                authorizeService.signOut();
                this.props.redirectToLogin();
            }
        }
    }

    render() {
        return (
            <>
                <ApiResultAlert message={this.state.localSuccessMessage} apiResult={this.state.apiResult} />
                <div>
                    <Image src={this.props.avatar} rounded />
                    <DropdownButton title="编辑" variant="dark" size="sm" style={{ position: "relative", left: "10px", top: "-40px", display: this.props.avatar === "" ? "none" : "block" }}>
                        <Dropdown.Item as="button" onClick={() => this.openDialog()}>上传照片</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => this.removeAvatar()}>移除照片</Dropdown.Item>
                    </DropdownButton>
                </div>

                <form style={{ display: "none" }}>
                    <input type="file" ref={this.fileInput} onChange={(x) => this.uploadAvatar(x)} />
                </form>
            </>
        );
    }
}

export default connect(null, dispatch => {
    return {
        redirectToLogin: () => dispatch(push("/account/login")),
        setGlobalError: (message) => dispatch(uiActions.setGlobalError(true, message))
    }
})(ChangeProfilePicture);