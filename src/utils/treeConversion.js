export function dataToFlatten(data) {//菜单数据扁平化
  let arr = []
  let operationUrl = '', hidden = false,parentOperationId=''
  data.forEach((item) => {
    if(item.operationUrl){
      operationUrl = item.operationUrl.substr(0,item.operationUrl.length-6)
    }
    let component = '',hasChildren=false
    if(item.parentOperationId){
      parentOperationId = item.parentOperationId
      if(item.childrens && item.childrens.length>0){
        component = 'ParentView'
      }else{
        component = item.operationUrl
      }
    }else{
      if(item.childrens.length>0){
        hasChildren = true
      }
      component = 'Layout'
    }
    if(item.enabled == 1){
      hidden = false
    }
    arr.push({
      menuId: item.operationId,
      id:item.operationId,
      pid: parentOperationId,
      path: operationUrl,
      component:component,
      // hasChildren: hasChildren,
      icon: item.iconName,
      label: item.operationName,
      menuName: item.operationName,
      sort: item.sort,
      meta: {
        icon: item.iconName,
        noCache: false,
        title: "系统管理",
      },
      name:item.operationName,
      children:[],
      hidden: hidden,
    })
    if (item.childrens?.length) {
      arr = arr.concat(dataToFlatten(item.childrens))
    }
  })
  return arr
}

export function transfer(origin){
  let root = null;
  let arr = []
  Object.keys(origin).forEach(key => {
    let obj = origin[key]
    if (obj.pid == '') {
      root = obj;
      arr.push(root)
      return
    }

    let parent = root;
    !parent.children && (parent.children = [])
    parent.children.push(obj)
  })
  return arr
}
