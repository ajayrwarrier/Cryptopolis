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
      
      const todoList = await $.getJSON('Election.json')
      App.contracts.TodoList = TruffleContract(todoList)
      App.contracts.TodoList.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.todoList = await App.contracts.TodoList.deployed()

      const todoList1 = await $.getJSON('Citizenship.json')
      App.contracts.TodoList1 = TruffleContract(todoList1)
      App.contracts.TodoList1.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.todoList1 = await App.contracts.TodoList1.deployed()
      console.log(App.todoList)
    },
    render: async() =>{
        var electionInstance;
        var loader = $("#loader");
        var content = $("#content");

        loader.show();
        content.hide();

  // Load account data
        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
            App.account = account;
            $("#accountAddress").html("Your Account: " + account);
            }
        });

    electionInstance= App.todoList;
    citizenInstance = App.todoList1;
    candidatesCount= await electionInstance.candidatesCount();
    console.log(candidatesCount);
    var candidatesResults = $("#candidatesResults");
    candidatesResults.empty();

    var candidatesSelect = $('#candidatesSelect');
    candidatesSelect.empty();

    for (var i = 1; i <= candidatesCount; i++) {
        candidate = await electionInstance.candidates(i)
        var id = candidate[0];
        var name = candidate[1];
        var voteCount = candidate[2];

        // Render candidate Result
        var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
        candidatesResults.append(candidateTemplate);

        // Render candidate ballot option
        var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
        candidatesSelect.append(candidateOption);
    }  
    hasVoted= await electionInstance.voters(App.account)
    isCitizen = await citizenInstance.auth(App.account)
    // Do not allow a user to vote
    
      if(hasVoted || !isCitizen)
      $('form').hide();
    
    loader.hide();
    content.show();
  
},
castVote:function(){
  
    var candidateId = $('#candidatesSelect').val();
    electionInstance= App.todoList;
    electionInstance.vote(candidateId, { from: App.account });

      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
  
      
  
}


}
  
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })