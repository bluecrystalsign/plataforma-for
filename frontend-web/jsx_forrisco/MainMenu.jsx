import React from "react";
import $ from "jquery";
import {Link} from "react-router";
import UserSession from "forpdi/jsx/core/store/UserSession.jsx";
import PolicyStore from "forpdi/jsx_forrisco/planning/store/Policy.jsx";
import StructureStore from "forpdi/jsx/planning/store/Structure.jsx";
import PlanRiskStore from "forpdi/jsx_forrisco/planning/store/PlanRisk.jsx";

import _ from "underscore";
import Messages from "forpdi/jsx/core/util/Messages.jsx";
import Observables from "forpdi/jsx/core/util/Observables.jsx";
import PermissionsTypes from "forpdi/jsx/planning/enum/PermissionsTypes.json";


export default React.createClass({
	contextTypes: {
		router: React.PropTypes.object,
		accessLevel: React.PropTypes.number.isRequired,
		accessLevels: React.PropTypes.object.isRequired,
		permissions: React.PropTypes.array.isRequired,
		roles: React.PropTypes.object.isRequired,
		toastr: React.PropTypes.object.isRequired,
	},
	getInitialState() {
		return {
			user: UserSession.get("user"),
			logged: !!UserSession.get("logged"),
			hidden: false,
			policies: [],
			plans: [],
			domainError: true,
			archivedPolicies: [],
			archivedPoliciesHidden: true,
			showBudgetElement: false
		};
	},
	componentDidMount() {
		var me = this;

		if (this.state.logged && EnvInfo.company != null) {
			me.refresh();
		}
		UserSession.on("login", session => {
			me.setState({
				user: session.get("user"),
				logged: true
			});

			if (EnvInfo.company != null) {
				me.refresh();
			}
		}, me);
		UserSession.on("logout", session => {
			me.setState({
				user: null,
				logged: false,
				policy: null
			});
		}, me);

		PolicyStore.on("unarchivedPolicyForMenu", (store) => {
			if (store.status === 400) {
				me.setState({
					domainError: true
				});
			} else if (store.status === 200 || store.status === undefined) {
				me.setState({
					policies: store.data,
					domainError: false
				});
			}
		}, me);

		PlanRiskStore.on("unarchivedPlanRiskForMenu", (response) => {
			var listedPlans = [];
			if (response.status !== true) {
				this.setState({domainError: true});
			}

			if (response.success === true) {
				response.data.map(planRisk => {
					listedPlans.push({
						id: planRisk.id,
						label: planRisk.name
					});
				});
				this.setState({
					plans: listedPlans
				})
			}
		}, me);

		me.checkRoute(me.props.location.pathname);

	/*	PolicyStore.on("archivedpolicylisted", (store) => {
			if (store.status == 400) {
				me.setState({
					domainError: true
				});
			} else if (store.status == 200 || store.status == undefined) {
				me.setState({
					archivedPolicies: store.data,
					domainError: false
				});
			}
		}, me);

		PolicyStore.on("policyarchived", (model) => {
			me.setState({
				archivedPoliciesHidden: false
			});
		}, me);
*/


		//me.context.router.listenBefore((opts, next) => {
		//     /*me.checkRoute(opts.pathname);*/
		//    if (next)
		//        next();
		//});
	},

	componentWillUnmount() {
		UserSession.off(null, null, this);
		PolicyStore.off(null, null, this);
		PlanRiskStore.off(null, null, this);
		StructureStore.off(null, null, this);
	},

	checkRoute(pathname) {
		this.setState({
			hidden: false
		});
		/*if (pathname && pathname.startsWith("/plan/")) {
            this.setState({
                hidden: false
            });
        } else {
            this.setState({
                hidden: false
            });
		}*/
	},


	onLogout() {
		UserSession.dispatch({
			action: UserSession.ACTION_LOGOUT
		});
	},
	tweakHidden() {
		var hidden = !this.state.hidden;
		this.setState({
			hidden: hidden
		});
		Observables.ResizeMenu.notify();

		PolicyStore.dispatch({
			action: PolicyStore.ACTION_MAIN_MENU_STATE,
			data: hidden
		});
	},

	refresh() {
		PolicyStore.dispatch({
			action: PolicyStore.ACTION_FIND_UNARCHIVED_FOR_MENU
		});
		/*PolicyStore.dispatch({
			action: PolicyStore.ACTION_FIND_ARCHIVED
		});*/
		PlanRiskStore.dispatch({
			action: PlanRiskStore.ACTION_FIND_UNARCHIVED_FOR_MENU
		});
		//PlanRiskStore.off(null, null, this);
	},

	/*listArchivedPolicies() {
		if (this.state.archivedPoliciesHidden) {
			this.setState({
				archivedPoliciesHidden: false
			});
		} else {
			this.setState({
				archivedPoliciesHidden: true
			});
		}
	},*/

	disableRegisterNewPlan(event) {
		if (this.state.policies && (this.state.policies.length === 0)) {
			event.preventDefault();
			this.context.toastr.addAlertError(Messages.get("label.UnableRegisterPlanRisk"))
		}
	},

	render() {

		if (!this.state.logged) {
			return <div style={{display: 'none'}}/>;
		}

		return (<div className={(this.state.hidden ? 'forrisco-app-sidebar-hidden' : 'forrisco-app-sidebar') + ' fpdi-tabs-stacked'}>
			{this.state.plans.length > 0 ?
            <div className="frisco-tabs-nav">
    			<Link to="/forrisco/home" activeClassName="active">
                    <span className="fpdi-nav-icon mdi mdi-view-dashboard icon-link"
                    /> {Messages.getEditable("label.dashboard","fpdi-nav-label", PermissionsTypes.FORRISCO_EDIT_MESSAGES_PERMISSION)}
                </Link>
    		</div> : ""}
			{this.state.policies && (this.state.policies.length > 0) ?
				this.state.policies.map((policy, index) => {
					return <div className="frisco-tabs-nav" key={"open-plan-" + index}>
						<Link to={"/forrisco/policy/" + policy.id + "/"} activeClassName="active">
							<span className="fpdi-nav-icon mdi mdi-gavel icon-link" title={policy.name}/>
							<span className="fpdi-nav-label" title={policy.name}>
								{(policy.name).length <= 24 ? policy.name : (policy.name).split("", 20).concat(" ...")}
							</span>
						</Link>
					</div>;
				})
				: ""}

			{(this.state.plans && this.state.plans.length > 0)  ?

				this.state.plans.map((plan, index) => {
					return (
						<div className="frisco-tabs-nav" key={index}>
							<Link to={"/forrisco/plan-risk/" + plan.id + "/"} activeClassName="active">
								<span className="fpdi-nav-icon mdi mdi-shield icon-link" title={plan.label}/>
								<span className="fpdi-nav-label" title={plan.label}>
									{
										(plan.label.length) <= 24 ? plan.label : (plan.label.split("", 12).concat(" ..."))
									}
								</span>
							</Link>
						</div>
					)
				})
				: ""}
			{
				(this.context.roles.ADMIN ||
					_.contains(this.context.permissions, PermissionsTypes.FORRISCO_MANAGE_POLICY_PERMISSION))
					?
						<div>
							<div className="frisco-tabs-nav">
								<Link to="/forrisco/policy/new" activeClassName="active">
									<span className="fpdi-nav-icon mdi mdi-plus icon-link"/>
									<span className="fpdi-nav-label">
								{Messages.getEditable("label.newPolicy", "fpdi-nav-label")}
							</span>
								</Link>
							</div>
						</div>
					: ""
			}

			{
				(this.context.roles.ADMIN ||
					_.contains(this.context.permissions, PermissionsTypes.FORRISCO_MANAGE_PLAN_RISK_PERMISSION))
				&&
				<div>
					<div className="fpdi-tabs-nav">
						<Link to="/forrisco/plan-risk/new" activeClassName="active"
							onClick={this.disableRegisterNewPlan}>
							<span className="fpdi-nav-icon mdi mdi-plus icon-link"/>
							<span className="fpdi-nav-label">
								{Messages.getEditable("label.newPlanRisco", "fpdi-nav-label")}
								</span>
						</Link>
					</div>
				</div>
			}

			<hr className="divider"/>
			{this.state.archivedPolicies && (this.state.archivedPolicies.length > 0) ?
				<div>
					<div className="fpdi-tabs-nav">
						<a onClick={this.listArchivedPolicies}>
							<span className="fpdi-nav-icon mdi mdi-folder-lock icon-link"/>
							<span className="fpdi-nav-label"> Políticas arquivadas </span>
							{this.state.hidden ? "" : <span
								className={this.state.archivedPoliciesHidden ? "mdi mdi-chevron-down floatRight icon-link" : "mdi mdi-chevron-up floatRight icon-link"}/>}

						</a>
					</div>
					{!this.state.archivedPoliciesHidden && !this.state.hidden ?
						this.state.archivedPolicies.map((policy, index) => {
							return <div className="fpdi-tabs-nav" key={"archived-plan-" + index}>
								<Link to={"/policy/" + policy.id + "/"} activeClassName="active marginLeft35"
									  className="marginLeft35">
									<span className="fpdi-nav-icon mdi mdi-chart-bar icon-link" title={policy.name}/>
									<span className="fpdi-nav-label" title={policy.name}>
											{(policy.name.length) <= 24 ? policy.name : (policy.name.split("", 12).concat(" ..."))}
										</span>
								</Link>
							</div>;
						})
						: ""}
				</div>
				: ""}

			<div className="frisco-tabs-nav fpdi-nav-hide-btn">
				<a onClick={this.tweakHidden}>
                    <span
						className={"fpdi-nav-icon mdi " + (this.state.hidden ? "mdi-arrow-right-bold-circle icon-link" : "mdi-arrow-left-bold-circle icon-link")}
					/> <span className="fpdi-nav-label">
                            {Messages.getEditable("label.collapseMenu", "fpdi-nav-label")}
                    </span>
				</a>
			</div>

			<span className="fpdi-fill"/>
		</div>);
	}
});
