<template>
  <section class="container">    
    <h1 class="title">
      SCHEDULERS
    </h1>           
     <el-select v-model="scheduler_id" placeholder="Viewing Schedulers" @change="onChange">
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
     <el-input placeholder="Scheduler Name" v-show="form_loaded" style="width:50%" v-model="scheduler_name" required></el-input>     
        <el-table
          :data="tableData"          
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
          name="start[]"          
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
            name="end[]"
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
    <el-button type="danger" style="float:left;" v-show="form_loaded && !scheduler_new" @click="del">Delete</el-button>    
  </el-form-item>
  </el-form>
  </section>
</template>

<script>
import axios from '~/plugins/axios'
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
  async asyncData () {
    let { data } = await axios.get('/api/schedulers')    
    return { schedulers: data }
  },
  data(){
    return {      
      tableData:[],
      scheduler_new:false,
      form_loaded:false ,
      scheduler_id:'',
      scheduler_name:'',
      schedulers:[]   
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
    convertHrsMinsToMins(hms){
      let a = hms.split(':'); // split it at the colons
      // Hours are worth 60 minutes.
      return(+a[0]) * 60 + (+a[1]);
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
            this.scheduler_name = schedule.name;
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
        this.scheduler_name = '';
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
        // console.log('create!');
        if(this.$refs.form.$el.checkValidity()){
          let set = Object.assign([],days);
          console.log(set);

          this.$refs.form.$el.elements['start[]'].forEach((el,i) => {            
              set[i] = set[i] || {};
              set[i].start = this.convertHrsMinsToMins(el.value);
          });
          
          this.$refs.form.$el.elements['end[]'].forEach((el,i) => {            
              set[i] = set[i] || {};
              set[i].end = this.convertHrsMinsToMins(el.value);            
          }); 
          let { data } = await axios.post('/api/schedulers',{   
                         name:this.scheduler_name,
                         set: set
                        }
                    )
          this.schedulers = data;
          console.log(this.schedulers);
        }

        // console.log(data);
    },
    async update() {        
        console.log('update!');   
        if(this.$refs.form.$el.checkValidity()){
          let set = Object.assign([],days);
          
          this.$refs.form.$el.elements['start[]'].forEach((el,i) => {            
              set[i].start = this.convertHrsMinsToMins(el.value);
          });
          
          this.$refs.form.$el.elements['end[]'].forEach((el,i) => {                        
              set[i].end = this.convertHrsMinsToMins(el.value);            
          });    

          let { data } = await axios.post('/api/schedulers/update',{  
                         id:this.scheduler_id,  
                         name:this.scheduler_name,
                         set:set
                        }
                    )
        }
        this.schedulers = data;
        // console.log(data);
    },
    async del() { 
      let { data } = await axios.delete('/api/schedulers/'+this.scheduler_id)
      this.schedulers = data;
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
