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
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    
    // Update loading state
    App.setLoading(false)
  },

  
  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  },

  createCitizen: async () => {
    App.setLoading(true)
    const username = $('#username').val()
    const fname = $('#firstname').val()
    const lname = $('#lastname').val()
    const fathname = $('#fathersname').val()
    const age = $('#age').val()
    const address = $('#address').val()
    const gender = $( "#gender option:selected" ).text();

    console.log(App.account);
    await App.citizenship.addCitizen(App.account,String(fname),String(lname),String(fathname),parseInt(age),String(gender),String(address));
    window.location.reload()
  },

  view: async () => {
    App.setLoading(true)
    var citzenCount = await App.citizenship.citizenCount()
    citzenCount = citzenCount.toNumber()
    console.log(citzenCount)
    $('#test3').html("Number of Citizens:"+citzenCount+"<br><br>")

    for (var i = 1; i <= citzenCount; i++) {
      const Citizen = await App.citizenship.citizens(i)
      var cid = Citizen[0].toNumber()
      var username = Citizen[1]
      var fname = Citizen[2]
      var lname = Citizen[3]
      var fathname = Citizen[4]
      var age = Citizen[5].toNumber()
      var gender = Citizen[6]
      var address = Citizen[8]
      
      $('#test3').append("<h3> <strong>Citizen id:"+cid+"</strong><br></h3>")
      $('#test3').append("<h3> <strong>User Name:"+username+"</strong><br></h3>")
      $('#test3').append("<h3> First Name:"+fname+"<br></h3>")
      $('#test3').append("<h3> Last Name:"+lname+"<br></h3>")
      $('#test3').append("<h3> Father's Name:"+fathname+"<br></h3>")
      $('#test3').append("<h3> Age:"+age+"<br></h3>")
      $('#test3').append("<h3> Gender:"+gender+"<br></h3>")
      $('#test3').append("<h3> Address:"+address+"<br><br><br></h3>")

       }
    
     },

     search: async () => {
      App.setLoading(true)
      const ciid = $('#Cid').val()
      var intcid = parseInt(ciid)
      var citzenCount = await App.citizenship.citizenCount()
      citzenCount = citzenCount.toNumber()
      
      

      for (var i = 1; i <= citzenCount; i++) {
        const Citizen = await App.citizenship.citizens(i)
        var cid = Citizen[0].toNumber()
        var username = Citizen[1]
        var fname = Citizen[2]
        var lname = Citizen[3]
        var fathname = Citizen[4]
        var age = Citizen[5].toNumber()
        var gender = Citizen[6]
        var address = Citizen[8]
        
        if(intcid==cid){
          $('#test3').append("<h3> <strong>Citizen id:"+cid+"</strong><br></h3>")
      $('#test3').append("<h3> User Name:"+username+"<br></h3>")
      $('#test3').append("<h3> First Name:"+fname+"<br></h3>")
      $('#test3').append("<h3> Last Name:"+lname+"<br></h3>")
      $('#test3').append("<h3> Father's Name:"+fathname+"<br></h3>")
      $('#test3').append("<h3> Age:"+age+"<br></h3>")
      $('#test3').append("<h3> Gender:"+gender+"<br></h3>")
      $('#test3').append("<h3> Address:"+address+"<br><br><br></h3>")
        }
        }

         }
      
  }

$(() => {
  $(window).load(() => {
    App.load()
  })
})