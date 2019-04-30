pragma solidity ^0.5.0;
contract Citizenship {
    uint public citizenCount;
    struct Citizen{
        uint id;
        string firstName;
        string lastName;
        string fathersname;
        uint age;
        string gender;
        bool votedorNot;
        string house_address;
    }
    mapping(uint => Citizen) public citizens;
    
    constructor() public {
        
    }
    function addCitizen (string memory _fn,string memory _ln,string memory _father,uint _age,string memory _gender,string memory _ha) 
    public {
        citizenCount ++;
        citizens[citizenCount] = Citizen(citizenCount, _fn,_ln,_father,_age,_gender,false,_ha);        
    }
}
