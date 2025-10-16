const resource = (name: string) => ({
  index: `${name}.index`,
  create: `${name}.create`,
  store: `${name}.store`,
  show: `${name}.show`,       // needs {id}
  edit: `${name}.edit`,       // needs {id}
  update: `${name}.update`,   // needs {id}
  destroy: `${name}.destroy`, // needs {id}
})

export const routes = {
  employees: resource("employees"),
  notifications: resource("notifications"),
  notificationsTypes: resource("notifications-types"),
  roles: resource("roles"),
  companies: resource("companies"),
  clients: resource("clients"),
  projects: resource("projects"),
  tasks: resource("tasks"),
  expenses: resource("expenses"),
  invoices: resource("invoices"),
}
