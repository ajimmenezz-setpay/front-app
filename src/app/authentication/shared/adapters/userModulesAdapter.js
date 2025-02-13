const adapterModules = modules =>
  modules?.map(module => ({
    name: module?.moduleName,
    path: module?.path,
    icon: module?.icon,
    actions: module?.moduleActions,
    modules: adapterModules(module?.modules)
  })) ?? null

export const UserModulesAdapter = data => {
  const userActions = data?.userActions !== '' ? data?.userActions?.split(',') : []
  const modules = data?.menu || []

  const filterModules = modules?.filter(
    category => category?.modules?.length > 0 && category?.modules?.filter(submodule => submodule?.modules?.length > 0)
  )

  const modulesAdapted = filterModules?.map(category => ({
    ...category,
    modules: adapterModules(category?.modules)
  }))

  return {
    menu: modulesAdapted,
    permissions: userActions
  }
}
