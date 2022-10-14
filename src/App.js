import React, {Component} from 'react';
import CardExampleCard from './display/ui'

let web3 = require('./utils/initWeb3')
let lotteryInstance = require('./eth/lotteryInstance')

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            manager: '',
            round: '',
            winner: '',
            playerCounts: 0,
            balance: 0,
            players: [],
            currentAccount: '',
        }

    }

    //内置钩子函数，在页面渲染之后自动调用
    componentDidMount() {
        this.jianTing()
    }



    //内置钩子函数，在页面渲染之前调用
    async componentWillMount() {
        //获取当前的所有地址
        let accounts = await web3.eth.getAccounts()
        let manager = await lotteryInstance.methods.manager().call()
        let round = await lotteryInstance.methods.round().call()
        let winner = await lotteryInstance.methods.winner().call()
        let playerCounts = await lotteryInstance.methods.getPlayersCount().call()

        //单位是wei，我们需要转换为ether单位
        let balanceWei = await lotteryInstance.methods.getBalance().call()
        //从wei单位转换为'ether'单位
        let balance = web3.utils.fromWei(balanceWei, 'ether')

        let players = await lotteryInstance.methods.getPlayers().call()

        let isShowButton = accounts[0] === manager ? 'inline' : 'none'

        this.setState({
            // manager: manager,
            manager,
            round,
            winner,
            playerCounts,
            balance,
            players,
            currentAccount: accounts[0],
            isClick : false,
            isShowButton
        })
    }

    //卸载钩子函数
    // componentDidMount

    jianTing = () => {
        window.ethereum.on("accountsChanged", function(accounts) {
            window.location.reload()
        });
    }

    play = async () => {
        this.setState({isClick : true})
        //1.调用play方法
        //2.转钱1ether
        console.log('play')
        try{
            await lotteryInstance.methods.play().send({
                from: this.state.currentAccount,
                value: web3.utils.toWei('1','ether'),
                gas: '3000000'
            })
            this.setState({isClick : false})
            window.location.reload()
            alert('投注成功!')
        }catch (e){
            this.setState({isClick : false})
            alert('投注失败!')
            console.log(e)
        }
    }

    kaiJiang = async () => {
        //1.调用play方法
        //2.转钱1ether
        this.setState({isClick : true})
        console.log('kaiJiang')
        try{
            await lotteryInstance.methods.kaiJiang().send({
                from: this.state.currentAccount,
                //value: web3.utils.toWei('1','ether'),
                gas: '3000000'
            })
            this.setState({isClick : false})

            let winner = await lotteryInstance.methods.winner().call()

            window.location.reload()
            alert(`开奖成功!\n中奖人:${winner}`)
        }catch (e){
            this.setState({isClick : false})
            alert('开奖失败!')
            console.log(e)
        }

    }

    tuiJiang = async () => {
        //1.调用play方法
        //2.转钱1ether
        this.setState({isClick : true})
        console.log('tuiJiang')
        try{
            await lotteryInstance.methods.tuiJiang().send({
                from: this.state.currentAccount,
                //value: web3.utils.toWei('1','ether'),
                gas: '3000000'
            })
            this.setState({isClick : false})
            window.location.reload()
            alert('退奖成功!')
        }catch (e){
            this.setState({isClick : false})
            alert('退奖失败!')
            console.log(e)
        }

    }


    render() {

        return (
            <div>
                <CardExampleCard
                    manager={this.state.manager}
                    round={this.state.round}
                    winner={this.state.winner}
                    balance={this.state.balance}
                    players={this.state.players}
                    playersCounts={this.state.playerCounts}
                    currentAccount={this.state.currentAccount}
                    play = {this.play}
                    kaiJiang = {this.kaiJiang}
                    tuiJiang = {this.tuiJiang}
                    isClick = {this.state.isClick}
                    isShowButton = {this.state.isShowButton}
                />
            </div>
        );
    }
}

export default App;
