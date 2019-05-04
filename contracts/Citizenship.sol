pragma solidity ^0.5.0;
contract Citizenship {
    uint public citizenCount;
    struct Citizen{
        uint id;
        address username;
        string firstName;
        string lastName;
        string fathersname;
        uint age;
        string gender;
        bool votedorNot;
        string house_address;
    }
    mapping(uint => Citizen) public citizens;
    mapping(address=>bool) public auth;
    
    constructor() public {
        addCitizen(0x345cA3e014Aaf5dcA488057592ee47305D9B3e10,"Pikachu","Pika","R",20,"Male","Palet Town");
    }

    function addCitizen (address _addr,string memory _fn,string memory _ln,string memory _father,uint _age,string memory _gender,string memory _ha) 
    public {
        citizenCount ++;
        citizens[citizenCount] = Citizen(citizenCount,_addr, _fn,_ln,_father,_age,_gender,false,_ha);    
        auth[_addr] = true; 
    }
    
}
