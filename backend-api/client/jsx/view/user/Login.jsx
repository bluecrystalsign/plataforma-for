
import React from "react";
import {Link} from "react-router";
import Form from "forpdi/jsx/widget/form/Form.jsx";
import UserSession from "forpdi/jsx/store/UserSession.jsx";
import LoadingGauge from "forpdi/jsx/widget/LoadingGauge.jsx";
import Modal from "forpdi/jsx/widget/Modal.jsx";

import AppLogo from "forpdi/img/logo.png";

var VerticalForm = Form.VerticalForm;

export default React.createClass({
	getInitialState() {
		return {
			loaded: !UserSession.get("loading"),
			fields: [{
				name: "email",
				type: "email",
				placeholder: "",
				label: "E-mail"
			},{
				name: "password",
				type: "password",
				placeholder: "",
				label: "Senha"
			}]
		};
	},
	onSubmit(data) {
		UserSession.dispatch({
			action: UserSession.ACTION_LOGIN,
			data: data
		});
	},
	componentWillMount() {
		var me = this;
		UserSession.on("login", model => {
			location.assign("#/home");
		}, me);
		UserSession.on("loaded", () => {
			me.setState({loaded: true});
		}, me);

	},
	componentDidMount() {
		if (!!UserSession.get("logged")) {
			location.assign("#/home");
		}
	},
	componentWillUnmount() {
		UserSession.off(null, null, this);
	},
	render() {
		if (!this.state.loaded) {
			return <LoadingGauge />;
		}
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-xs-12 text-center">
						<div className="cmp-login-header">
							<img className="cmp-login-brand" src={AppLogo} alt="ForPDI Logo" />
							<h1>Faça seu login</h1>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-4 col-md-offset-4">
						<div className="cmp-card">
							<div className="cmp-login-body">
								<VerticalForm
									onSubmit={this.onSubmit}
									fields={this.state.fields}
									store={UserSession}
									submitLabel="Fazer Login"
									blockButtons={true}
								/>
							</div>

							<div className="cmp-login-footer">
								<div className="row">
									<div className="col-md-12 text-center">
										<a href="#/recover-password">Esqueceu sua senha?</a>
									</div>
									<br/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
