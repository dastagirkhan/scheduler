<template>
  <section class="container">   
    <h1 class="title">
      Create scheduler
    </h1>
    <h2 class="info">    
    </h2>
        <el-form ref="form" label-width="120px">
     <el-input placeholder="Scheduler Name" style="width:50%" v-model="scheduler_name" required></el-input>     
        <el-table
          :data="tableData"          
          style="width: 75%;margin: 0px auto;"
          align="center"          
        >
    <el-table-column      
      prop="day"            
      label="Day"
      width="180"
    >    
    </el-table-column>    
    <el-table-column 
      label="Start"        
      width="280">
      <template slot-scope="scope">
          <el-time-select
          v-model="scope.row.start"          
          name="start[]"          
          :picker-options="{
            start: '09:00',
            step: '00:15',
            end: '18:30'
          }"          
          placeholder="From">
        </el-time-select>
      </template>
    </el-table-column>
    <el-table-column
      prop="to"
      label="End"      
      width="280">
      <template slot-scope="scope">
            <el-time-select
            v-model="scope.row.end"
            name="end[]"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30'
            }"            
            placeholder="To">
          </el-time-select>
      </template>
    </el-table-column>
  </el-table>
   <el-form-item>
    <br/>    
    <el-button type="primary" style="float:left;" @click="create">Create</el-button>           
  </el-form-item>
  </el-form>
    <nuxt-link class="button" to="/">Schedulers</nuxt-link>
  </section>
</template>

<script>
import axios from '~/plugins/axios'
import {convertMinsToHrsMins,convertHrsMinsToMins} from '~/plugins/helpers'
const days = [
  { "day" : "SUN"},
  { "day" : "MON"},
  { "day" : "TUE"},
  { "day" : "WED"},
  { "day" : "THU"},      
  { "day" : "FRI"},
  { "day" : "SAT"}
]
export default {
  data(){
    return {  
      scheduler_name:'',    
      tableData:[
              { "day" : "SUN" , "start" : '' , "end" : ''},
              { "day" : "MON" , "start" : '' , "end" : ''},
              { "day" : "TUE" , "start" : '' , "end" : ''},
              { "day" : "WED" , "start" : '' , "end" : ''},
              { "day" : "THU" , "start" : '' , "end" : ''},      
              { "day" : "FRI" , "start" : '' , "end" : ''},
              { "day" : "SAT" , "start" : '' , "end" : ''}
      ]     
    }
  },
  methods: {   
  async create() {
        // console.log('create!');                
        if(this.$refs.form.$el.checkValidity()){          
          let set = Object.assign([],days);          

          this.$refs.form.$el.elements['start[]'].forEach((el,i) => {            
              set[i] = set[i] || {};
              set[i].start = convertHrsMinsToMins(el.value);
          });
          
          this.$refs.form.$el.elements['end[]'].forEach((el,i) => {            
              set[i] = set[i] || {};
              set[i].end = convertHrsMinsToMins(el.value); 
              if( (!isNaN(set[i].start) && !isNaN(set[i].end) && set[i].end > set[i].start ) === false){
                  set[i].start = ''
                  set[i].end = ''
              }              
          }); 
          let { data } = await axios.post('/api/schedulers/create',{   
                            name:this.scheduler_name,
                            set: set
                         })       
          if(data.status == 'NOK'){
            this.$message({
              type:'error',
              message:data.message
            })
          }else {
            this.$router.replace({path:'/'});         
          }
        } else {
             this.$alert('Please fill the form before submit, Scheduler name is required!');            
        }       
   }
  }
}
</script>