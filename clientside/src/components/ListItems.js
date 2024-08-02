import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ListItems.css';

function ListItems() {
  const [jsonData, setJsonData] = useState(null);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editItem, setEditItem] = useState({
    itemname: '',
    category: '',
    price: '',
    quantity: ''
  });
  const [currentItemId, setCurrentItemId] = useState(0);
  
  // delete item
  const deleteItem = (id) => {
    axios.delete('http://localhost:3000/items/' + id)
    .then(function (response) {
      // handle success
      console.log('Item deleted successfully');
      listAllItems();
    })
    .catch(function (error) {
      // handle error
      console.log('Error deleting item id:' + id + '***' + error);
    });
  };  

  const resetCurrItem = () => {
    setEditItem({ // reset the current item
      itemname: '',
      category: '',
      price: '',
      quantity: ''
    });
    setCurrentItemId(0); // reset the current item id
  }

  // edit item
  const editTheItem = () => {
    console.log('editTheItem id: ',currentItemId);
    console.log('sssssss',editItem);
    axios.put('http://localhost:3000/items/' + currentItemId, editItem)
      .then(function (response) {
        // handle success
        console.log('Item updated successfully');
        listAllItems(); // refresh the table
        setShowEditItemModal(false); // turn off the popup window
        resetCurrItem();
      })
      .catch(function (error) {
        // handle error
        console.log('Error adding item: ' + error);
      });
  };

  // click on the edit button
  function editClick(theItem) {
    setCurrentItemId(theItem.id);
    console.log('edit Click id: ',currentItemId);
    setEditItem({
      itemname: theItem.itemname,
      category: theItem.category,
      price: theItem.price,
      quantity: theItem.quantity
    });
    console.log('---edit item----',theItem);
    setShowEditItemModal(true);
  }

  // click on the Confirm button
  function confirmClick() {
    if (currentItemId === 0) {
      // add a new item
      console.log('Add a new item');
      return addItem();
    } else {
      return editTheItem();
    }
  }

  // add a new item
  const addItem = () => {
    axios.post('http://localhost:3000/items/', editItem)
      .then(function (response) {
        // handle success
        console.log('Item added successfully');
        listAllItems(); // refresh table
        setShowEditItemModal(false); // turn off the popup
        resetCurrItem();
      })
      .catch(function (error) {
        // handle error
        console.log('Error adding item: ' + error);
      });
  };

  // display all items, also can be used to refresh
  const listAllItems = () => {
    axios.get('http://localhost:3000/items')
    .then(function (response) {
      // handle success
//       console.log('===yyyyyyyyyyyyyyyyyy===========');
//       console.log(response.data);
      setJsonData(response.data); // store the data in the component
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  }

  useEffect(() => {
    listAllItems();
    setShowEditItemModal(false); // turn off the popup
  }, []); // refresh the table when start up

  // render table
  const renderTable = () => {
//    console.log('--xxxxxxxxxxx---');
//    console.log(jsonData);
    if (!jsonData) return null; // no data then return

    return (
      <table id="jsonTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
        {jsonData.map(item => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.itemname}</td>
            <td>{item.category}</td>
            <td>{item.price}</td>
            <td>{item.quantity}</td>
            <td><button onClick={() => editClick(item)}>Edit</button></td>
            <td><button onClick={() => deleteItem(item.id)}>Delete</button></td>
          </tr>
        ))}
        </tbody>
      </table>
    );
  };

  // render the popup window
  const renderEditItemModal = () => {
    if (!showEditItemModal) return null;
    console.log('renderEditItemModal id: ',currentItemId);
    var add_edit = '';
    if (currentItemId === 0) {  // show the title according to edit or add new
      add_edit = 'Add New Item';
    } else {
      add_edit = 'Edit the Item';
    }

    return (
      <div className="modal">
        <div className="modal-content">
          <h2>{add_edit}</h2>
          <table className="editTable">
          <tbody>
          <tr>
            <td><label>Item Name</label></td>
            <td>
              <input type="text" value={editItem.itemname} onChange={(e) => setEditItem({ ...editItem, itemname: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td><label>Category</label></td>
            <td>
              <input type="text" value={editItem.category} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td><label>Price</label></td>
            <td>
              <input type="text" value={editItem.price} onChange={(e) => setEditItem({ ...editItem, price: e.target.value })} />
            </td>
          </tr>
          <tr>
            <td><label>Quantity</label></td>
            <td>
              <input type="text" value={editItem.quantity} onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })} />
            </td>
          </tr>
        </tbody>
        </table>
        <button onClick={() => confirmClick()}>Confirm</button>
        <button onClick={() => {resetCurrItem();setShowEditItemModal(false);}}>Cancel</button>
      </div>
    </div>
    );
  };

  return (
    <div>
      {renderTable()} {/* render table */}
      <button onClick={() => {setCurrentItemId(0);setShowEditItemModal(true);}}>Add New Item</button>
      {renderEditItemModal()} {/* render the popup */}
   </div>
  );
}

export default ListItems;
