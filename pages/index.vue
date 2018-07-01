<template>
  <section class="container">    
    <h1 class="title">
      SCHEDULERS
    </h1>           
     <el-select v-model="schedulers_model" placeholder="Viewing Schedulers" @change="onChange">
       <el-option
        v-for="item in schedulers"
        :key="item.id"
        :label="item.name"
        :value="item.id"        
        >
       </el-option>
     </el-select>
     <i class="el-icon-circle-plus" @click="createScheduler"></i>
     <br>
     <br>
     <el-form ref="form" label-width="120px">
     <el-input placeholder="Scheduler Name" v-show="scheduler_new" style="width:50%"></el-input>     
        <el-table
          :data="tableData"
          stripe
          style="width: 75%;margin: 0px auto;"
          align="center"
          @cell-click="editRow"
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
          :picker-options="{
            start: '09:00',
            step: '00:15',
            end: '18:30'
          }"
          :disabled="!scope.row.edited"
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
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30'
            }"
            :disabled="!scope.row.edited"
            placeholder="To">
          </el-time-select>
      </template>
    </el-table-column>
  </el-table>
   <el-form-item>
    <br/>
    <el-button type="primary" style="float:left;" v-show="form_loaded && scheduler_new" @click="create">Create</el-button>    
    <el-button type="primary" style="float:left;" v-show="form_loaded && !scheduler_new" @click="update">Update</el-button>    
  </el-form-item>
  </el-form>
  </section>
</template>

<script>
import axios from '~/plugins/axios'

export default {
  async asyncData () {
    let { data } = await axios.get('/api/schedulers')    
    return { schedulers: data }
  },
  data(){
    return {      
      schedulers_model:'',
      tableData:[],
      scheduler_new:false,
      form_loaded:false
    }
  }, 
  head(){
    return {
      title: 'Schedulers'
    }
  },  
  methods: { 
    convertMinsToHrsMins(mins) {
        let h = Math.floor(mins / 60);
        let m = mins % 60;
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        return `${h}:${m}`;
    },  
    editRow(row){  
      if(!this.scheduler_new){
        this.tableData.map(function(td){td.edited = false; return td;});   
        row.edited = true;
      }
    },
    onChange (option) {  
      this.scheduler_new = false;          
      this.form_loaded = true;          
      this.schedulers.map((schedule) => {
        if(schedule.id == option){            
            // this.tableData = schedule.set;
            this.tableData = schedule.set.map((set) => {                
                if(set.to_hrs !== true){
                  set.start = this.convertMinsToHrsMins(set.start);
                  set.end   = this.convertMinsToHrsMins(set.end);
                  set.to_hrs = true;
                }
                return set;
            });  
        }  
      });          
    },
    createScheduler(){
        this.scheduler_new = true;
        this.form_loaded = true;          
        this.tableData = [
              { "day" : "SUN" , "start" : '' , "end" : '' , edited:true},
              { "day" : "MON" , "start" : '' , "end" : '' , edited:true},
              { "day" : "TUE" , "start" : '' , "end" : '' , edited:true},
              { "day" : "WED" , "start" : '' , "end" : '' , edited:true},
              { "day" : "THU" , "start" : '' , "end" : '' , edited:true},      
              { "day" : "FRI" , "start" : '' , "end" : '' , edited:true},
              { "day" : "SAT" , "start" : '' , "end" : '' , edited:true}
        ];  
    },
    async create() {
        console.log('create!');
        let { data } = await axios.post('/api/schedulers/create',{   
                       name:'Lunch Specials',
                       set:[
                          { "scheduleId" : 4523 , "day" : "SUN" , "start" : 660 , "end" : 900 },
                          { "scheduleId" : 4529 , "day" : "MON" , "start" : 660 , "end" : 900 },
                          { "scheduleId" : 4528 , "day" : "TUE" , "start" : 660 , "end" : 900 },
                          { "scheduleId" : 4527 , "day" : "WED" , "start" : 660 , "end" : 900 },
                          { "scheduleId" : 4526 , "day" : "THU" , "start" : 660 , "end" : 900 },      
                          { "scheduleId" : 4525 , "day" : "FRI" , "start" : 660 , "end" : 900 },
                          { "scheduleId" : 4524 , "day" : "SAT" , "start" : 660 , "end" : 900 }
                       ]
                      }
                  )
        console.log(data);
    },
    async update() {
        console.log('update!');        
        let { data } = await axios.post('/api/schedulers/update',{   
                       name:'Lunch Specials',
                       set:[
                          { "scheduleId" : 4523 , "day" : "SUN" , "start" : 660 , "end" : 900 },
                          { "scheduleId" : 4529 , "day" : "MON" , "start" : 660 , "end" : 900 },
                          { "scheduleId" : 4528 , "day" : "TUE" , "start" : 660 , "end" : 900 },
                          { "scheduleId" : 4527 , "day" : "WED" , "start" : 660 , "end" : 900 },
                          { "scheduleId" : 4526 , "day" : "THU" , "start" : 660 , "end" : 900 },      
                          { "scheduleId" : 4525 , "day" : "FRI" , "start" : 660 , "end" : 900 },
                          { "scheduleId" : 4524 , "day" : "SAT" , "start" : 660 , "end" : 900 }
                       ]
                      }
                  )
        console.log(data);
    }
  }

}
</script>

<style scoped>
.title
{
  margin: 30px 0;
}
.schedulers
{
  list-style: none;
  margin: 0;
  padding: 0;
}
.scheduler
{
  margin: 10px 0;
}
.container i{
  font-size: 32px;
}
</style>
