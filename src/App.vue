<template>
  <div class="common-layout">
    <el-container>
      <el-header style="padding:0px;">
        <el-menu
    class="menu-wrapper"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :menu-align-right="true"
  >
  <el-menu-item >
      <p @click="withdrawFormVisible = true" v-if="isLogin==true">Withdraw</p>
  </el-menu-item>
  <el-menu-item >
      <p  @click="loginFormVisible = true" v-if="isLogin == false">login</p>
      <p @click="logOut" v-else>LogOut</p>
  </el-menu-item>
  </el-menu>

      </el-header>
      <el-main>
        <el-row v-if="isLogin == false">
          <el-col :span="24"> <el-text class="mx-1" type="danger">Please log in before using it. The api-key is saved in the local browser and is safe.</el-text></el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-card style="max-width: 460px;min-height:315px" class="no-border">
              <template #header>
                <div class="card-header">
                  <el-select
                  v-model="pair"
                  placeholder="Select"
                  size="small"
                  style="width: 240px"
                  @change="selectPair()"
                >
                  <el-option label="ATN-USD" value="ATN-USD" />
                  <el-option label="NTN-USD" value="NTN-USD" />
                </el-select>
                </div>
                
              </template>
              <el-table :data="askList" style="width: 100%;color:red" @row-click="setPrice">
                <el-table-column prop="price" label="Price"  />
                <el-table-column prop="amount" label="Amount" width="180" align="right" />
              </el-table>
              <div style="margin-top:18px;margin-bottom:18px;margin-left:10px"><el-text style="font-size:18px;">{{price}}</el-text></div>
              <el-table :data="bidList" style="width: 100%;color:green" :show-header=false @row-click="setPrice">
                <el-table-column prop="price" label="Price"  />
                <el-table-column prop="amount" label="Amount" width="180" align="right" />
              </el-table>
            
            </el-card>
          </el-col>
          <el-col :span="18">
            <el-card >
              <template #header>
                <div class="card-header">
                  <span>Trade</span>
                </div>
              </template>
              <el-row>
                
                <el-col :span="12">
                  <el-card style="max-width: 480px">
                      <el-form  :model="buyForm" label-width="auto" style="max-width: 600px">
                      <el-text style="text-align:right;margin-left: 280px;" >balance:{{balanceData.USD.available}} USD</el-text>
                      <el-form-item label="Price">
                        <el-input v-model="buyForm.price" ><template #append>USD</template></el-input>
                      </el-form-item>
                      <el-form-item label="Amount">
                        <el-input v-model="buyForm.amount"><template #append>{{this.symbol}}</template></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" style="width:100%;" @click="buyOrder">Buy</el-button>
                      </el-form-item>
                    </el-form>
                    </el-card>
                </el-col>
                <el-col :span="12">
                  <el-card style="max-width: 480px">
                      <el-form  :model="sellForm" label-width="auto" style="max-width: 600px">
                      <el-text style="text-align:right;margin-left: 185px " >balance:{{symbolBalance.available}} {{this.symbol}}</el-text>
                      <el-form-item label="Price">
                        <el-input v-model="sellForm.price" ><template #append>USD</template></el-input>
                      </el-form-item>
                      <el-form-item label="Amount">
                        <el-input v-model="sellForm.amount"><template #append>{{this.symbol}}</template></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="warning" style="width:100%" @click="sellOrder">Sell</el-button>
                      </el-form-item>
                    </el-form>
                    </el-card>
                </el-col>
              </el-row>

              <el-row style="margin-top:18px">
          <el-col :span="24">
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
              <el-tab-pane label="Order" name="orderTable">
                <el-table :data="orderList" stripe style="width: 100%">
            
                  <el-table-column prop="order_id" label="Order ID" width="80" />
                  <el-table-column prop="timestamp" label="Trade Time" :show-overflow-tooltip="true"  />
                  <el-table-column prop="pair" label="Pair" />
                  <el-table-column prop="type" label="Type" />
                  <el-table-column prop="side" label="Side" />
                  <el-table-column prop="amount" label="Amount" />
                  <el-table-column prop="price" label="Price" />
                  <el-table-column prop="status" label="Status" />
                  <el-table-column fixed="right" label="Operations" width="120">
                    <template #default="scope">
                      <el-button v-if="scope.row.status == 'open'" link type="primary" size="small" @click="cancelOrder(scope.row)"
                        >Cancel</el-button>
                    </template>
                  </el-table-column>
                </el-table>

              </el-tab-pane>
              <el-tab-pane label="Trade" name="tradeTable">
                  <el-table :data="tradeList" stripe style="width: 100%">
                  <el-table-column prop="trade_id" label="Trade ID" width="180" />
                  <el-table-column prop="order_id" label="Order ID" width="180" />
                  <el-table-column prop="timestamp" label="Trade Time" :show-overflow-tooltip="true" />
                  <el-table-column prop="pair" label="Pair" />
                  <el-table-column prop="side" label="Side" />
                  <el-table-column prop="amount" label="Amount" />
                  <el-table-column prop="price" label="Price" />
                </el-table>
              </el-tab-pane>
              
            </el-tabs>
          </el-col>
        </el-row>


            </el-card>
          </el-col>
          
        </el-row>
        
      </el-main>
    </el-container>
  </div>


  <el-dialog v-model="loginFormVisible" title="Login" width="500">
    <el-form :model="loginForm">
      <el-form-item label="Api Key" :label-width="formLabelWidth">
        <el-input v-model="loginForm.api_key" autocomplete="off" />
      </el-form-item>
      
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="loginFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="apiKeyLogin()">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="withdrawFormVisible" title="Withdraw" width="500">
    <el-form :model="withdrawForm">
      <el-form-item label="Symbol">
      <el-select v-model="withdrawForm.symbol" placeholder="please select withdraw symbol">
        <el-option label="ATN" value="ATN" />
        <el-option label="NTN" value="NTN" />
      </el-select>
    </el-form-item>
      <el-form-item label="Amount" :label-width="formLabelWidth">
        <el-input v-model="withdrawForm.amount" autocomplete="off" placeholder="Please input withdraw Amount" />
      </el-form-item>
      
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="withdrawFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="withdrawConfirm()">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script>
// import { ArrowDown } from '@element-plus/icons-vue'
import axios from 'axios';
import { ElNotification } from 'element-plus';

export default {
  name: 'App',
  components: {
    
  },
  data(){
    return {
      withdrawFormVisible:false,
      withdrawForm:{},
      isLogin:false,
      loginForm: {
        api_key:"",
      },
      loginFormVisible:false,
      pair:"NTN-USD",
      quoteData: {},
      tradeData:{},
      sellForm:{
        side: "ask"
      },
      buyForm:{
        side: "bid"
      },
      balanceData: {
        ATN:{
          available: 0,
        },
        NTN:{
          available: 0,
        },
        USD:{
          available: 0,
        }
      },
      tradeList: [],
      orderList: [],
      askList:[],
      bidList:[],
      depthTime:"",
      price: 0,
      timer:null,
      activeName:'orderTable',
      symbol: "NTN",
      symbolBalance:{},
    }
  },

mounted () {
  console.log(window.localStorage.getItem("api_key"));
    if(window.localStorage.getItem("api_key")){
        this.isLogin = true;
        this.getOrderBook();
        this.getBalance();
        this.getTradeList();
        this.getOrderList();
    }
   this.timer = setInterval(()=>{
       this.getOrderBook();
   },10000)
 },

 beforeUnmount() {
    clearInterval(this.timer)
    this.timer = null;
  },



  created() {

    console.log(window.localStorage.getItem("api_key"));
    if(window.localStorage.getItem("api_key")){
        this.isLogin = true;
        this.getOrderBook();
        this.getBalance();
        this.getTradeList();
        this.getOrderList();
    }
    
    
  },
  methods: {
    selectPair(){
        this.refresh();
        if(this.pair == 'ATN-USD'){
          this.symbol = "ATN";
        }else if(this.pair == 'NTN-USD'){
          this.symbol = "NTN";
        }
    },
    refresh(){
        this.getOrderBook();
        this.getBalance();
    },
    withdrawConfirm(){
        axios.post('https://cax.piccadilly.autonity.org/api/withdraws',this.withdrawForm).then(response => {
        console.log("withdraw",response.data);

        if(response.data){
            ElNotification({
              title: 'Withdraw Accepted',
              message: "txid:"+ response.data.txid,
            })
        }
        location.reload();
      }).catch(error => {
        ElNotification({
              title: 'Withdraw Forbidden',
              message: error.message,
            })
        console.error(error);
      })
    },
    logOut(){
        window.localStorage.setItem("api_key","");
        location.reload();
    },
    apiKeyLogin(){
        window.localStorage.setItem("api_key",this.loginForm.api_key);
        this.loginFormVisible = false
        location.reload();
    },
    handleClick(tab){
      console.log(tab.props.name);
      if(tab.props.name == 'tradeTable'){
        this.getTradeList();
      }else if(tab.props.name == 'orderTable'){
        this.getOrderList();
      }
    },
    setPrice(row){
      this.sellForm.price = row.price;
      this.buyForm.price = row.price;
    },
    getOrderBook() {
      axios.get(`https://cax.piccadilly.autonity.org/api/orderbooks/${this.pair}/depth`).then(response => {
        this.askList = response.data.asks.slice(0,8).sort((a, b) => b.price - a.price);
        this.bidList = response.data.bids.slice(0,8);
        this.price = this.bidList[0].price;
        this.depthTime = response.data.timestamp;
        console.log(this.askList);
      }).catch(error => {
        console.error(error);
      })
    },

    getBalance() {
      // let obj = {}
      axios.get('https://cax.piccadilly.autonity.org/api/balances').then(response => {
        const data = JSON.parse(JSON.stringify(response.data));
        data.forEach(i =>{
            this.balanceData[i.symbol] = i;
        });
        this.symbolBalance = this.balanceData[this.symbol]
        console.log(this.balanceData);
      }).catch(error => {
        
        if(error.response.status == 401){
          ElNotification({
              title: 'Unauthorized',
              message: "Unknown API Key.Please log in again and enter the correct apikey",
            })
          this.logOut();
        }
        
        console.error("1111",error);
      })
    },

    getTradeList(){
      axios.get('https://cax.piccadilly.autonity.org/api/trades').then(response => {
        this.tradeList = response.data.sort((a, b) => b.order_id - a.order_id).slice(0,10);
        console.log(this.tradeList);
      }).catch(error => {
        console.error(error);
      })
    },

    getOrderList(){
      axios.get('https://cax.piccadilly.autonity.org/api/orders').then(response => {
        this.orderList = response.data.sort((a, b) => b.order_id - a.order_id).slice(0,10);
        console.log(this.orderList);
      }).catch(error => {
        console.error(error);
      })
    },

    buyOrder(){
      this.buyForm.pair= this.pair;
      
      axios.post('https://cax.piccadilly.autonity.org/api/orders',this.buyForm).then(response => {
        console.log("buy",response.data);
        this.getTradeList();
        this.getOrderList();
        this.getBalance();
      }).catch(error => {
        console.error(error);
      })
    },
    sellOrder(){
      this.sellForm.pair= this.pair;
      console.log(this.sellForm);
     
      axios.post('https://cax.piccadilly.autonity.org/api/orders',this.sellForm).then(response => {
        console.log("sell",response.data);
         this.getTradeList();
      this.getOrderList();
      this.getBalance();
      }).catch(error => {
        console.error(error);
      })
    },
    cancelOrder(order){
      console.log(order);
      axios.delete('https://cax.piccadilly.autonity.org/api/orders/'+order.order_id).then(response => {
        console.log("cancel",response.data);
        this.getTradeList();
        this.getOrderList();
        this.getBalance();
      }).catch(error => {
        console.error(error);
      })
    },
    withdrawOrder(){

    }

    
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
.menu-wrapper {
  display: flex;
  justify-content: flex-end;
}
.no-border .el-card__body {
  border: none !important;
  box-shadow: none !important;
}
</style>
