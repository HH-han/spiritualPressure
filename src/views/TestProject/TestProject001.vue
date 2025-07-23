<template> 
<div>
  <TestPage/>
  <h1>Test Project 001</h1>
  <!--列表  -->
   <div>
     <table>
       <thead>
         <tr>
           <th>列1</th>
           <th>列2</th>
         </tr>
       </thead>
       <tbody>
         <tr v-for="(item, index) in tableData" :key="index">
           <td>{{ item.col1 }}</td>
           <td>{{ item.col2 }}</td>
         </tr>
       </tbody>
     </table>
   </div>
   <!-- 笔记 -->
   <div>
     <div class="note-container">  
     <h2>编写你的笔记</h2>  
     <textarea placeholder="在这里输入你的笔记..."></textarea><br>  
     <button class="TestProject_button_bj">保存笔记</button>  
     </div>
   </div>
   <!-- 下拉框 -->
   <div class="zhankai">
     <button @click="toggleDropdown_test">展开</button>
     <div v-show="isDropdownVisible_test">
       <div v-if="isDropdownVisible_test">
         <div v-for="(item, index) in tableData" :key="index">
           <div>
             <h3>{{ item.col1 }}</h3>
             <p>{{ item.col2 }}</p>
           </div>
         </div>
       </div>
     </div>
   </div>
   <!-- 固定显示 -->
   <div class="fixed-element">我会固定在右上角！</div> 
    <!--图片循环展示  -->
</div>
 </template>  
 
<script>
export default {  
  name: 'TestProject',
  components: {
  },
  // 引入子组件
  data() {  
    return { 
      isDropdownVisible_test: false,
      isDropdownVisible_Test001: false,
      tableData: [  
        { col1: '数据1', col2: '数据2' },  
        { col1: '数据3', col2: '数据4' },  
        // 可以继续添加更多数据  
      ],
      
    }
      
  },  
  methods: {  
    // 在这里定义你的方法 
    toggleDropdown_test() {
      this.isDropdownVisible_test = !this.isDropdownVisible_test;
    }, 
} 

}
</script>
<style scoped>

.TestProject_button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  height: 50px;
  border-radius: 15px;
}
.TestProject_button:hover {
  background-color: #c9e549;
  color: rgb(0, 0, 0);
  text-decoration: none;
  cursor: pointer;
}
.note-container {  
  background-color: #fff;  
  border-radius: 5px;  
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);  
  padding: 20px;  
        }  
textarea {  
  width: 100%;  
  height: 200px;  
  padding: 10px;  
  border: 1px solid #ccc;  
  border-radius: 5px;  
  resize: none; /* 禁用用户调整大小 */  
}  
.TestProject_button_bj {  
  margin-top: 10px;  
  padding: 10px 15px;  
  background-color: #28a745;  
  color: white;  
  border: none;  
  border-radius: 5px;  
  cursor: pointer;  
}  
.TestProject_button_bj:hover {  
  background-color: #218838;  
} 
.zhankai {
  margin-top: 20px;
  text-align: center;
}
.zhankai button {
  background-color: #4c95af;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 15px;
}
.zhankai button:hover {
  background-color: #4caf86;
  color: white;
  text-decoration: none;
  cursor: pointer;

}
.fixed-element {  
  /* position: fixed; */
  /* 固定定位 */
  /* top: 20px;   
  right: 10px;    */
  width: 150px; /* 固定宽度 */  
  height: 100px; /* 固定高度 */
  border-radius: 15px;  
  text-align: center;
  background-color: rgba(255, 0, 0, 0.7); /* 半透明背景 */  
  } 
</style>

 