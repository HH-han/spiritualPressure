<template>
  <div class="test-project-004">
    <TestPage />
    <h1>Test Project 004</h1>
    <!-- FBI -->
    <a href="">
      <div class="fbi">
        <div class="fbi_content">
            <h1>FBI WARNING</h1>
        </div>
        <div class="fbi_content_second">
            <h3>Federal Law provides severe civil and criminal penalties for 
                the unauthorized reproduction, distribution, 
                or exhibition of copyrighted motion pictures 
                (Title 17, United States Code, Sections 501 
                and 508). The Federal Bureau of Investigation 
                investigates allegations of criminal copyright
                infringement (Title 17, United States Code, 
                Section 506).</h3>
        </div>
      </div>
    </a>
    <div>
      <MyPosts />
    </div>
  </div>

</template>
<script>
import MyPosts from '@/components/DisplayBox/MyPosts.vue';
export default {
  name: 'TestProject004',
  components: {
    MyPosts

  },
};
</script>
<style>
.fbi {
    width: 100%;
    height: 100vh;
    background-color: rgb(0, 0, 0);
    display: flex;              /* 使用Flexbox布局 */  
    flex-direction: column;     /* 设置主轴方向为垂直方向 */  
    justify-content: center;    /* 主轴方向上居中对齐 */
    align-items: center;
    text-align: center;
}
.fbi_content {
    width: 300px;
    height: 60px;
    color: white;
    background-color: red;
}
.fbi_content h1 {
    color: #ffffff;
}
.fbi_content_second h3{
    color: #ffffff;
    width: 550px;
}
</style>

