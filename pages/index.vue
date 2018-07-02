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
     <!-- <i class="el-icon-circle-plus" @click="createScheduler"></i> -->
     <nuxt-link class="" to="/create"><i class="el-icon-circle-plus"></i></nuxt-link>
     <br>
     <br>
     <el-form ref="form" label-width="120px" v-show="form_loaded">
     <el-input placeholder="Scheduler Name" style="width:50%" v-model="scheduler_name" required></el-input>     
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
    <el-button type="primary" style="float:left;" v-show="form_loaded && !scheduler_new" @click="update">Update</el-button>    
    <el-button type="danger" style="float:left;" v-show="form_loaded && !scheduler_new" @click="del">Delete</el-button>    
  </el-form-item>
  </el-form>
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
                  set.start = convertMinsToHrsMins(set.start);
                  set.end   = convertMinsToHrsMins(set.end);
                  set.to_hrs = true;
                }
                return set;
            });  
        }  
      });          
    },    
    async update() {        
        console.log('update!');   
        if(this.$refs.form.$el.checkValidity()){
          let set = Object.assign([],days);
          
          this.$refs.form.$el.elements['start[]'].forEach((el,i) => {            
              set[i].start = convertHrsMinsToMins(el.value);
          });
          
          this.$refs.form.$el.elements['end[]'].forEach((el,i) => {                        
              set[i].end = convertHrsMinsToMins(el.value);            
              if( (!isNaN(set[i].start) && !isNaN(set[i].end) && set[i].end > set[i].start ) === false){
                  set[i].start = ''
                  set[i].end = ''
              }
          });    

          let { data } = await axios.post('/api/schedulers/update',{  
                         id:this.scheduler_id,  
                         name:this.scheduler_name,
                         set:set
                        }
                    )
        if(data.status == 'NOK'){
            this.$message({
              type:'error',
              message:data.message
            })
          }else {
            this.$router.go();
          }
        }else {
          this.$alert('Please fill the form before submit, Scheduler name is required!');
        }
        
        
    },
    async del() { 
       this.$confirm('Are you sure to delete this scheduler set?')
          .then(async () => {
              let { data } = await axios.delete('/api/schedulers/'+this.scheduler_id)      
              this.$router.go();       
          })
          .catch(() => {});
      
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
