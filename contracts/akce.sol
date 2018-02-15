pragma solidity ^0.4.13;
contract UUIDProvider {
    function UUID4() returns (bytes16 uuid);
}

contract owned {
    address public owner;
    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require (msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }
}

contract tokenRecipient { function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData); }

contract token {
    /* Public variables of the token */
    string public standard = 'AKCE 0.1b';
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    /* This generates a public event on the blockchain that will notify clients */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function token(
        uint256 initialSupply,
        string tokenName,
        uint8 decimalUnits,
        string tokenSymbol
        ) {
        balanceOf[msg.sender] = initialSupply;              // Give the creator all initial tokens
        totalSupply = initialSupply;                        // Update total supply
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes
        decimals = decimalUnits;                            // Amount of decimals for display purposes
    }

    /* Send coins */
    function transfer(address _to, uint256 _value) {
        require (balanceOf[msg.sender] >= _value);           // Check if the sender has enough
        require (balanceOf[_to] + _value >= balanceOf[_to]); // Check for overflows
        balanceOf[msg.sender] -= _value;                     // Subtract from the sender
        balanceOf[_to] += _value;                            // Add the same to the recipient
        Transfer(msg.sender, _to, _value);                   // Notify anyone listening that this transfer took place
    }

    /* Allow another contract to spend some tokens in your behalf */
    function approve(address _spender, uint256 _value)
        returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        return true;
    }

    /* Approve and then communicate the approved contract in a single tx */
    function approveAndCall(address _spender, uint256 _value, bytes _extraData)
        returns (bool success) {    
        tokenRecipient spender = tokenRecipient(_spender);
        if (approve(_spender, _value)) {
            spender.receiveApproval(msg.sender, _value, this, _extraData);
            return true;
        }
    }

    /* A contract attempts to get the coins */
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        require (balanceOf[_from] >= _value);                 // Check if the sender has enough
        require (balanceOf[_to] + _value >= balanceOf[_to]);  // Check for overflows
        require (_value <= allowance[_from][msg.sender]);	  // Check allowance
        balanceOf[_from] -= _value;                           // Subtract from the sender
        balanceOf[_to] += _value;                             // Add the same to the recipient
        allowance[_from][msg.sender] -= _value;
        Transfer(_from, _to, _value);
        return true;
    }

    /* This unnamed function is called whenever someone tries to send ether to it */
    function () {
        revert();     // Prevents accidental sending of ether
    }
}

contract AkceToken is owned, token {
    UUIDProvider public uuidProvider = UUIDProvider(0x35eD5FdC573DFd145695Cb2411eF1ef769bE2CD2);
	
    uint256 public sellPrice;
    uint256 public buyPrice;

	struct SpendData
	{
		address from_;
		address target_;
		uint256 amount_;
	}
	
	struct MarketData
	{
		bytes16 id_;
		string name_;
		string type_;
	}

	
	mapping (bytes16 => SpendData) public spentData;
	mapping (address => bytes16[]) public spents;
	mapping (address => MarketData) public markets;
	
    mapping (address => bool) public frozenAccount;

    /* This generates a public event on the blockchain that will notify clients */
    event FrozenFunds(address target, bool frozen);
	
	event RewardAkce(address target, uint256 amount);
	event SpendAdded(address from, bytes16 id);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function AkceToken(
        uint256 initialSupply,
        string tokenName,
        uint8 decimalUnits,
        string tokenSymbol
    ) token (initialSupply, tokenName, decimalUnits, tokenSymbol) 
	{
	}

	function updateUUIDProvider(address uuidAddress) onlyOwner {
		uuidProvider = UUIDProvider(uuidAddress);
	}

    /* Send coins */
    function transfer(address _to, uint256 _value) {
        require (balanceOf[msg.sender] >= _value);           // Check if the sender has enough
        require (balanceOf[_to] + _value >= balanceOf[_to]); // Check for overflows
        require (!frozenAccount[msg.sender]);                // Check if frozen
        balanceOf[msg.sender] -= _value;                     // Subtract from the sender
        balanceOf[_to] += _value;                            // Add the same to the recipient
        Transfer(msg.sender, _to, _value);                   // Notify anyone listening that this transfer took place
    }

    /* A contract attempts to get the coins */
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        require (!frozenAccount[_from]);                        // Check if frozen            
        require (balanceOf[_from] >= _value);                 // Check if the sender has enough
        require (balanceOf[_to] + _value >= balanceOf[_to]);  // Check for overflows
        require (_value <= allowance[_from][msg.sender]);   // Check allowance
        balanceOf[_from] -= _value;                          // Subtract from the sender
        balanceOf[_to] += _value;                            // Add the same to the recipient
        allowance[_from][msg.sender] -= _value;
        Transfer(_from, _to, _value);
        return true;
    }
	
	function setMyMarket(string _name, string _type) {
		if (markets[msg.sender].id_ == 0x0) {
			markets[msg.sender].id_ = getUUID();
		}
		markets[msg.sender].name_ = _name;
		markets[msg.sender].type_ = _type;
	}

    function mintToken(address target, uint256 mintedAmount) onlyOwner {
        balanceOf[target] += mintedAmount;
        totalSupply += mintedAmount;
        Transfer(0, this, mintedAmount);
        Transfer(this, target, mintedAmount);
    }

    function freezeAccount(address target, bool freeze) onlyOwner {
        frozenAccount[target] = freeze;
        FrozenFunds(target, freeze);
    }

    function setPrices(uint256 newSellPrice, uint256 newBuyPrice) onlyOwner {
        sellPrice = newSellPrice;
        buyPrice = newBuyPrice;
    }
    
    function getUUID() returns(bytes16) {
        return uuidProvider.UUID4();
    }
    
    function isFrozen(address _adr) constant returns (bool) {
        return frozenAccount[_adr];
    }
	
	function isMarketAccount(address _adr) constant returns (bool) {
		return markets[_adr].id_ != 0x0;
	}
	
	function getSpents() constant returns (bytes16[]) {
		return spents[msg.sender];
	}
	
	function getSpent(bytes16 guid) constant returns (address, address, uint256) {
		return (spentData[guid].from_, spentData[guid].target_, spentData[guid].amount_);
	}
	
	function getMarketData(address market) constant returns (bytes16, string, tw) {
		return (markets[market].id_, markets[market].name_, markets[market].type_);
	}
		
    function buy() payable {
        uint256 amount = msg.value / buyPrice;                // calculates the amount
        require (balanceOf[this] >= amount);               // checks if it has enough to sell
        balanceOf[msg.sender] += amount;                   // adds the amount to buyer's balance
        balanceOf[this] -= amount;                         // subtracts amount from seller's balance
        Transfer(this, msg.sender, amount);                // execute an event reflecting the change
    }

    function sell(uint256 amount) {
        require (balanceOf[msg.sender] >= amount);        // checks if the sender has enough to sell
        balanceOf[this] += amount;                         // adds the amount to owner's balance
        balanceOf[msg.sender] -= amount;                   // subtracts the amount from seller's balance
        if(!msg.sender.send(amount * sellPrice)) revert();
        Transfer(msg.sender, this, amount);            // executes an event reflecting on the change
    }
	
	function payViaAkce(address target) payable {
		uint256 amount = msg.value / buyPrice;             // calculates the amount
        require (balanceOf[this] >= amount);            // checks if it has enough to sell
		uint256 back_amount = amount * 5 / 100;
		balanceOf[msg.sender] += back_amount;		   // give 5% back
		balanceOf[target] += amount;				  // transfer money
		Transfer(this, target, amount);
		Transfer(this, msg.sender, back_amount);
		RewardAkce(msg.sender, back_amount);
		
		bytes16 blobId = uuidProvider.UUID4();
		while (spentData[blobId].from_ != 0x0) {
			blobId = uuidProvider.UUID4();
		}
		spentData[blobId] = SpendData({ from_: msg.sender, target_: target, amount_: amount });
		spents[msg.sender].push(blobId);
		SpendAdded(msg.sender, blobId);
	}
	
	function payWithAkce(address target, uint256 amount){
		if (transferFrom(msg.sender, target, amount)){
					bytes16 blobId = uuidProvider.UUID4();
		while (spentData[blobId].from_ != 0x0) {
			blobId = uuidProvider.UUID4();
		}
		spentData[blobId] = SpendData({ from_: msg.sender, target_: target, amount_: amount });
		spents[msg.sender].push(blobId);
		SpendAdded(msg.sender, blobId);
		}
	}
	
	function rewardAkce(uint256 amount) onlyOwner {
		require (balanceOf[this] >= amount);               // checks if it has enough to sell
        balanceOf[msg.sender] += amount;                   // adds the amount to buyer's balance
        balanceOf[this] -= amount;                         // subtracts amount from seller's balance
        Transfer(this, msg.sender, amount);                // execute an event reflecting the change
		RewardAkce(msg.sender, amount);
	}
}