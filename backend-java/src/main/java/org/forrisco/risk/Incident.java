package org.forrisco.risk;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.forpdi.core.user.User;

import br.com.caelum.vraptor.boilerplate.SimpleLogicalDeletableEntity;

/**
 * @author Matheus Nascimento
 * 
 */
@Entity(name = Incident.TABLE)
@Table(name = Incident.TABLE)

public class Incident extends SimpleLogicalDeletableEntity {
	public static final String TABLE = "frisco_incident";
	private static final long serialVersionUID = 1L;

	@ManyToOne(targetEntity = User.class, optional = false, fetch = FetchType.EAGER)
	private User user;

	@ManyToOne(targetEntity = Risk.class, optional = false, fetch = FetchType.EAGER)
	private Risk risk;

	@Column(nullable = false, length = 4000)
	private String description;

	@Column(nullable = false, length = 4000)
	private String action;

	@Column(nullable = false)
	private int type;

	@Column(nullable = false)
	private Date begin;

	@Transient
	private Long unitId;

	public Incident() {

	}

	public Incident(Incident incident) {

		this.description = incident.getDescription();
		this.action = incident.getAction();
		this.type = incident.getType();
		this.user = incident.getUser();
		this.begin = incident.getBegin();
	}

	public Incident(User user, Risk risk, String description, String action, Integer type, Date begin, Long unitId) {
		super();
		this.user = user;
		this.risk = risk;
		this.description = description;
		this.action = action;
		this.type = type;
		this.begin = begin;
		this.unitId = unitId;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Risk getRisk() {
		return risk;
	}

	public void setRisk(Risk risk) {
		this.risk = risk;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public Date getBegin() {
		return begin;
	}

	public void setBegin(Date begin) {
		this.begin = begin;
	}

	public Long getUnitId() {
		return unitId;
	}

	public void setUnitId(Long unitId) {
		this.unitId = unitId;
	}

}