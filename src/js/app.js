App = {
   loading: false,
   contracts: {},
 
   load: async () => {
     await App.loadWeb3()
     await App.loadAccount()
     await App.loadContract()
     await App.render()
   },
 
   // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
   loadWeb3: async () => {
     if (typeof web3 !== 'undefined') {
       App.web3Provider = web3.currentProvider
       web3 = new Web3(web3.currentProvider)
     } else {
       window.alert("Please connect to Metamask.")
     }
     // Modern dapp browsers...
     if (window.ethereum) {
       window.web3 = new Web3(ethereum)
       try {
         // Request account access if needed
         await ethereum.enable()
         // Acccounts now exposed
         web3.eth.sendTransaction({/* ... */})
       } catch (error) {
         // User denied account access...
       }
     }
     // Legacy dapp browsers...
     else if (window.web3) {
       App.web3Provider = web3.currentProvider
       window.web3 = new Web3(web3.currentProvider)
       // Acccounts always exposed
       web3.eth.sendTransaction({/* ... */})
     }
     // Non-dapp browsers...
     else {
       console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
     }
   },
 
   loadAccount: async () => {
     // Set the current blockchain account
     App.account = web3.eth.accounts[0]
   },
 
   loadContract: async () => {
     // Create a JavaScript version of the smart contract
     
     const citizenship = await $.getJSON('Citizenship.json')
    App.contracts.Citizenship = TruffleContract(citizenship)
    App.contracts.Citizenship.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.citizenship = await App.contracts.Citizenship.deployed()
     console.log(App.citizenship)
   },
   render: async() =>{
      isAdmin = await App.citizenship.admin(App.account)
      console.log(isAdmin)
      $('#admin').click(function(){
         if(isAdmin)
         window.location.href='/admin/index_admin.html';
         else
         alert("Not Admin")
      })
      $('#user').click(function(){
         window.location.href='/user/index_user.html';
      }) 
   }

}
 
 
 $(() => {
   $(window).load(() => {
     App.load()
   })
 })

