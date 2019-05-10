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
    const landrecords = await $.getJSON('LandRecords.json')
    App.contracts.LandRecords = TruffleContract(landrecords)
    App.contracts.LandRecords.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.landrecords = await App.contracts.LandRecords.deployed();

    const citizenship = await $.getJSON('Citizenship.json')
    App.contracts.Citizenship = TruffleContract(citizenship)
    App.contracts.Citizenship.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.citizenship = await App.contracts.Citizenship.deployed()
    var citizenCount = await App.citizenship.citizenCount()
    for (var i = 1; i <= citizenCount; i++) {
      const Citizen = await App.citizenship.citizens(i)
      var username = Citizen[1]
      console.log(username)
      $('#cid').append(new Option(username,username, true, true));
      
    }
    
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


  view: async () => {
    App.setLoading(true)
    const cid = $('#Cid').val()
    var recordCount = await App.landrecords.recordCount()
    recordCount = recordCount.toNumber()

    
    $('#test3').html("You Land Records:"+"<br><br>")

    for (var i = 1; i <= recordCount; i++) {
      const record = await App.landrecords.records(i)
      var rid = record[0].toNumber()
      var cid1 = record[1]
      var owner = record[2]
      var addr = record[3]
      var sq = record[4].toNumber()
      var lid = record[5].toNumber()
      if(cid1 == App.account){
        $('#test3').append("<div id="+"LID>");
      $('#test3').append("<h3> <strong>Record id:"+rid+"</strong><br></h3>")
      $('#test3').append("<h3> Citizen id:"+cid1+"<br></h3>")
      $('#test3').append("<h3> Owner name:"+owner+"<br></h3>")
      $('#test3').append("<h3> address:"+addr+"<br></h3>")
      $('#test3').append("<h3> Sq feet:"+sq+"<br></h3>")
      $('#test3').append("<h3> Land id:"+lid+"<br><br><br></h3>")
      $('#test3').append("</div>")
      $('#test3').append("<button id="+"generate"+">Generate Land Record</button>")  
      $('#generate').click(function(){
        var pdf = new jsPDF()
        pdf.text(35, 25, "LID ")
        pdf.text(35, 45, "Record ID: "+rid)
        pdf.text(35, 65, "Citizen ID: "+cid1)
        pdf.text(35, 85, "Owner: "+owner)
        pdf.text(35, 105, "Address: "+addr)
        pdf.text(35, 125, "Sq Feet: "+sq)
        pdf.text(35, 145, "Land ID: "+lid)
        pdf.save(LID.pdf)
     })
    }
      }
     },

     search: async () => {
      App.setLoading(true)
      const cid = $('#Cid').val()
      var intcid = parseInt(cid)
      var recordCount = await App.landrecords.recordCount()
      recordCount = recordCount.toNumber()
      
      

      for (var i = 1; i <= recordCount; i++) {
        const record = await App.landrecords.records(i)
        var rid = record[0].toNumber()
        var cid1 = record[1]
        var owner = record[2]
        var addr = record[3]
        var sq = record[4].toNumber()
        var lid = record[5].toNumber()


        if(cid1==intcid){
        $('#test3').html("<strong>Record Found</strong><br><br>")
        $('#test3').append("<h3> <strong>Record id:"+rid+"</strong><br></h3>")
        $('#test3').append("<h3> Citizen id:"+cid1+"<br></h3>")
        $('#test3').append("<h3> Land id:"+lid+"<br><br><br></h3>")
        $('#test3').append("<h3> Owner name:"+owner+"<br></h3>")
        $('#test3').append("<h3> address:"+addr+"<br></h3>")
        $('#test3').append("<h3> Sq feet:"+sq+"<br></h3>")
        
        }

         }
      
        }


}

$(() => {
  $(window).load(() => {
    App.load()
  })
})