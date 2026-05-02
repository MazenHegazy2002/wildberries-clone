// In-memory address storage
const addresses = new Map();

const getAddresses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userAddresses = addresses.get(userId) || [];
    res.json(userAddresses);
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Failed to get addresses' });
  }
};

const addAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, city, street, building, apartment, isDefault } = req.body;

    if (!city || !street || !building) {
      return res.status(400).json({ error: 'City, street, and building are required' });
    }

    // Initialize user addresses
    if (!addresses.has(userId)) {
      addresses.set(userId, []);
    }

    const userAddresses = addresses.get(userId);

    // If this is default, unset other defaults
    if (isDefault) {
      userAddresses.forEach(addr => addr.isDefault = false);
    }

    const address = {
      id: 'addr_' + Date.now(),
      userId,
      type: type || 'home',
      city,
      street,
      building,
      apartment: apartment || '',
      isDefault: isDefault || userAddresses.length === 0,
      createdAt: new Date().toISOString(),
    };

    userAddresses.push(address);
    res.status(201).json(address);
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ error: 'Failed to add address' });
  }
};

const updateAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { type, city, street, building, apartment, isDefault } = req.body;

    const userAddresses = addresses.get(userId) || [];
    const address = userAddresses.find(addr => addr.id === id);

    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    if (type) address.type = type;
    if (city) address.city = city;
    if (street) address.street = street;
    if (building) address.building = building;
    if (apartment !== undefined) address.apartment = apartment;
    
    if (isDefault) {
      userAddresses.forEach(addr => addr.isDefault = false);
      address.isDefault = true;
    }

    res.json(address);
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const userAddresses = addresses.get(userId) || [];
    const index = userAddresses.findIndex(addr => addr.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }

    userAddresses.splice(index, 1);
    res.json({ message: 'Address deleted' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
};

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };