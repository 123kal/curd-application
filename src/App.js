import React, { useState, useEffect } from 'react';
import './App.css'; // Import the main CSS file
import { useTable, useRowSelect } from 'react-table';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  writeBatch,
  updateDoc,
} from 'firebase/firestore';

import NewEntryForm from './NewEntryForm';
import UpdateEntryForm from './UpdateEntryForm';
import { db } from './firebase';

function App() {
  const [data, setData] = useState([]);
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

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
  
    idsToDelete.forEach((id) => {
      const docRef = doc(db, 'employees', id);
      batch.delete(docRef);
    });
  
    try {
      await batch.commit();
      console.log('Documents deleted successfully:', idsToDelete);
  
      const updatedData = data.filter((d) => !idsToDelete.includes(d.id));
      setData(updatedData);
    } catch (error) {
      console.error('Error deleting documents:', error);
    }
  };

  const addRow = async (newRow) => {
    try {
      const exists = data.some(entry => entry.email === newRow.email);
      if (exists) {
        console.log('Entry already exists:', newRow.email);
        return;
      }
  
      const docRef = await addDoc(collection(db, 'employees'), newRow);
      const newEmployee = { id: docRef.id, ...newRow };
      setData([...data, newEmployee]);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleUpdate = async (updatedEntry) => {
    try {
      setIsUpdating(false);
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
      <div className="button-group">
        <button className="button" onClick={deleteRows}>Delete Selected Rows</button>
        <button className="button" onClick={() => setShowNewEntryForm(true)}>Add New Row</button>
      </div>
      {showNewEntryForm && (
        <div className="form-overlay">
          <NewEntryForm
            onAdd={(newEntry) => {
              addRow(newEntry);
              setShowNewEntryForm(false);
            }}
          />
        </div>
      )}
      {isUpdating && selectedRow && (
        <div className="form-overlay">
          <UpdateEntryForm
            onUpdate={handleUpdate}
            onCancel={handleCancelUpdate}
            selectedRow={selectedRow.original}
          />
        </div>
      )}
      <table {...getTableProps()} className="table">
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
                className={row.id === (selectedRow && selectedRow.original.id) ? 'selected-row' : ''}
                onDoubleClick={() => handleRowDoubleClick(row)}
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
