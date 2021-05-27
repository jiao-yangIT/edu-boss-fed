<template>
  <div class="course-edit">
    <create-or-edit isEdit :courseId="courseId"></create-or-edit>
  </div>
</template>

<script>
import CreateOrEdit from './components/CreateOrEdit'
export default {
  name: 'CourseEdit',
  props: {
    courseId: {
      type: [Number, String],
      require: true
    }
  },
  components: {
    CreateOrEdit
  }
}
</script>
<style lang="scss" scoped></style>
