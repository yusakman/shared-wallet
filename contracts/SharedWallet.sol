pragma solidity >=0.5.0 <0.7.0;


contract SharedWallet {
    address payable owner;

    struct TransferDetail {
        address to;
        uint256 amount;
    }

    struct Senders {
        bool authorized;
        uint256 counter;
        mapping(uint256 => TransferDetail) transfers;
    }

    mapping(address => Senders) public authorizedAddress;

    event Deposit(address _sender, uint256 _amount);
    event Withdraw(address _sender, uint256 _amount, address _beneficiary);

    modifier onlyOwner() {
        require(owner == msg.sender, "You aren't authorized");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function() external payable {
        require(isAuthorized(msg.sender), "You have no permission.");
        emit Deposit(msg.sender, msg.value);
    }

    function sendFunds(uint256 amount, address payable receiver) public {
        require(isAuthorized(msg.sender), "You have no permission.");
        receiver.transfer(amount);
        emit Withdraw(msg.sender, amount, receiver);
        authorizedAddress[msg.sender].transfers[authorizedAddress[msg.sender]
            .counter]
            .to = receiver;
        authorizedAddress[msg.sender].transfers[authorizedAddress[msg.sender]
            .counter]
            .amount = amount;
        authorizedAddress[msg.sender].counter++;
    }

    function authorizeAddress(address _address) public onlyOwner {
        authorizedAddress[_address].authorized = true;
    }

    function unauthorizeAddress(address _address) public onlyOwner {
        authorizedAddress[_address].authorized = false;
    }

    function isAuthorized(address _address) public view returns (bool) {
        return authorizedAddress[_address].authorized || msg.sender == owner;
    }

    function getTransferDetail(address _address, uint256 _index)
        public
        view
        returns (address, uint256)
    {
        return (
            authorizedAddress[_address].transfers[_index].to,
            authorizedAddress[_address].transfers[_index].amount
        );
    }

    function destoyWallet() public onlyOwner {
        selfdestruct(owner);
    }
}
