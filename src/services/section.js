import request from '@/utils/request'

// 获取资源信息  getSectionAndLesson
export const getSectionAndLesson = courseId => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getSectionAndLesson',
    params: {
      courseId
    }
  })
}

// 节点完成拖拽后保存或更新课时内容
export const saveOrUpdateSection = data => {
  return request({
    method: 'POST',
    url: '/boss/course/section/saveOrUpdateSection',
    data
  })
}

// 新增或更新课时
export const saveOrUpdateLesson = data => {
  return request({
    method: 'POST',
    url: '/boss/course/lesson/saveOrUpdate',
    data
  })
}

// getBySectionId
export const getBySectionId = sectionId => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getBySectionId',
    params: {
      sectionId
    }
  })
}
