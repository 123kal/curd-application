import React, { useState, useEffect } from 'react';
import './App.css';
import { useTable, useRowSelect } from 'react-table';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  writeBatch,
  updateDoc, // Import updateDoc from Firestore
} from 'firebase/firestore';

import NewEntryForm from './NewEntryForm';
import UpdateEntryForm from './UpdateEntryForm'; // Import UpdateEntryForm
import { db } from './firebase';

function App() {
  const [data, setData] = useState([]);
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // Selected row for update
  const [isUpdating, setIsUpdating] = useState(false); // Flag for update mode

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'employees'));
        const fetchedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "id", Cell: ({ row }) => row.index + 1 },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      { Header: "Phone Number", accessor: "phone" },
      { Header: "City", accessor: "city" },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        selectedRowIds: {},
      },
    },
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <input
                type="checkbox"
                {...row.getToggleRowSelectedProps()}
              />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const deleteRows = async () => {
    const idsToDelete = selectedFlatRows.map((d) => d.original.id);
    console.log('IDs to delete:', idsToDelete);
  
    const batch = writeBatch(db);
  
    // Add delete operations to the batch
    idsToDelete.forEach((id) => {
      const docRef = doc(db, 'employees', id);
      batch.delete(docRef);
    });
  
    try {
      await batch.commit();
      console.log('Documents deleted successfully:', idsToDelete);
  
      // Update UI after deleting from Firestore
      const updatedData = data.filter((d) => !idsToDelete.includes(d.id));
      setData(updatedData); // Update the state after deletion
    } catch (error) {
      console.error('Error deleting documents:', error);
    }
  };

  const addRow = async (newRow) => {
    try {
      // Check if entry already exists in data
      const exists = data.some(entry => entry.email === newRow.email);
      if (exists) {
        console.log('Entry already exists:', newRow.email);
        return;
      }
  
      // Add the new entry to Firestore
      const docRef = await addDoc(collection(db, 'employees'), newRow);
      const newEmployee = { id: docRef.id, ...newRow };
      setData([...data, newEmployee]);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleUpdate = async (updatedEntry) => {
    try {
      setIsUpdating(false); // Reset update mode
      await updateDoc(doc(db, 'employees', updatedEntry.id), updatedEntry);
      const updatedData = data.map((row) =>
        row.id === updatedEntry.id ? updatedEntry : row
      );
      setData(updatedData);
      setSelectedRow(null);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleCancelUpdate = () => {
    setIsUpdating(false);
    setSelectedRow(null);
  };

  const handleRowDoubleClick = (row) => {
    setSelectedRow(row);
    setIsUpdating(true);
  };

  return (
    <div className="App">
      <h1 align="center">React-App</h1>
      <h4 align='center'>React-Table with CRUD operation using Firestore</h4>
      <div>
        <button onClick={deleteRows}>Delete Selected Rows</button>
        <button onClick={() => setShowNewEntryForm(true)}>Add New Row</button>
      </div>
      {showNewEntryForm && (
        <NewEntryForm
          onAdd={(newEntry) => {
            addRow(newEntry);
            setShowNewEntryForm(false);
          }}
        />
      )}
      {isUpdating && selectedRow && (
        <UpdateEntryForm
          rowData={selectedRow.original}
          onUpdate={handleUpdate}
          onCancel={handleCancelUpdate}
        />
      )}
      <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onDoubleClick={() => handleRowDoubleClick(row)}
                style={{ background: row.isSelected ? 'lightblue' : 'white' }}
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
