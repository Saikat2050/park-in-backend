export {
    getObject
  }


// manage created/updatedBy
async function getObject(res: Response, data: any, isUpdatedBy?: boolean) {
    let dataArr;
    if (isUpdatedBy) {
      dataArr = {
        ...data,
        updatedBy: res['userId']
      }
    } else {
      if (Array.isArray(data)) {
        dataArr = data.map(ob => ({ ...ob, createdBy: res['userId'] }))
      } else {
        dataArr = {
          ...data,
          createdBy: res['userId']
        }
      }
    }
    return dataArr
}