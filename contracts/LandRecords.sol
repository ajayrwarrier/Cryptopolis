pragma solidity ^0.5.0;

contract LandRecords{
    uint public recordCount = 0;

    struct Record {
    uint Rid;
    address Cid;
    string Owner;
    string Address;
    uint Sqfeet;
    uint Lid;
  }
   
  mapping(uint => Record) public records;

  constructor() public {
        createRecord(msg.sender,"Jane Doe","ABC lane,XYZ PO,PQR",100);
      }

  function createRecord(address cid,string memory _owner,string memory _address,uint _sqfeet) public {
    recordCount ++;
    records[recordCount] = Record(recordCount,cid,_owner,_address,_sqfeet,recordCount*100);
    
  }
}