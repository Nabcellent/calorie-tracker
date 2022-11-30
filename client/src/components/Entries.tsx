import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Modal } from "react-bootstrap";
import Entry from "./Entry";
import axios from "axios";

export type EntryType = {
    id?: string
    dish: string
    ingredients: string
    calories: number
    fat: number
}

const Entries = () => {
    const [entries, setEntries] = useState<EntryType[]>([])
    const [refreshData, setRefreshData] = useState(false)
    const [changeEntry, setChangeEntry] = useState({ change: false, id: '0' })
    const [changeIngredient, setChangeIngredient] = useState({ change: false, id: '0' })
    const [newIngredientName, setNewIngredientName] = useState('')
    const [addNewEntry, setAddNewEntry] = useState(false)
    const [newEntry, setNewEntry] = useState<EntryType>({ dish: '', ingredients: '', fat: 0, calories: 0 })

    const getAllEntries = () => {
        axios.get('http://localhost:8000/entries', { responseType: 'json' }).then(({ data, status }) => {
            if (status === 200) setEntries(data)
        })
    }

    const addSingleEntry = () => {
        setAddNewEntry(false)

        axios.post('http://localhost:8000/entries', newEntry).then(({ status }) => {
            if (status === 200) setRefreshData(true)
        })
    }

    const deleteEntry = (id?: string) => {
        axios.delete(`http://localhost:8000/entries/${id}`).then(({ status }) => {
            if (status === 200) setRefreshData(true)
        })
    }

    const changeSingleEntry = () => {
        changeEntry.change = false

        axios.put(`http://localhost:8000/entries/${changeEntry.id}`).then(({ status }) => {
            if (status === 200) setRefreshData(true)
        })
    }

    const changeIngredientForEntry = () => {
        axios.put(`http://localhost:8000/entries/ingredients/${changeIngredient.id}`, { ingredients: newIngredientName })
            .then(({ status }) => {
                if (status === 200) setRefreshData(true)
            })
    }

    useEffect(() => {
        getAllEntries();
    }, [])

    if (refreshData) {
        setRefreshData(false);
        getAllEntries();
    }

    return (
        <div>
            <Container>
                <Button onClick={() => setAddNewEntry(true)}>Track today's calories</Button>
            </Container>

            <Container>
                {entries?.length > 0 && entries.map((e, i) => (
                    <Entry key={`entry-${i}`} entry={e} setChangeIngredient={setChangeIngredient}
                           setChangeEntry={setChangeEntry} deleteEntry={deleteEntry}/>
                ))}
            </Container>

            <Modal show={addNewEntry} onHide={() => setAddNewEntry(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Calorie Entry</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Dish</Form.Label>
                        <Form.Control onChange={e => (newEntry.dish = e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Ingredients</Form.Label>
                        <Form.Control onChange={e => (newEntry.ingredients = e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Calories</Form.Label>
                        <Form.Control type={'number'} onChange={e => (newEntry.calories = Number(e.target.value))}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Fat</Form.Label>
                        <Form.Control type={'number'} onChange={e => (newEntry.fat = Number(e.target.value))}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => addSingleEntry()}>Add</Button>
                    <Button onClick={() => setAddNewEntry(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={changeEntry.change} onHide={() => setChangeEntry({ change: false, id: '0' })} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Change Entry</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Dish</Form.Label>
                        <Form.Control onChange={e => (newEntry.dish = e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Ingredients</Form.Label>
                        <Form.Control onChange={e => (newEntry.ingredients = e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Calories</Form.Label>
                        <Form.Control type={'number'} onChange={e => (newEntry.calories = Number(e.target.value))}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Fat</Form.Label>
                        <Form.Control type={'number'} onChange={e => (newEntry.fat = Number(e.target.value))}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => changeSingleEntry()}>Change</Button>
                    <Button onClick={() => setChangeEntry({ change: false, id: '0' })}>Cancel</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={changeIngredient.change} onHide={() => setChangeIngredient({ change: false, id: '0' })}
                   centered>
                <Modal.Header closeButton>
                    <Modal.Title>Change Ingredients</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group>
                        <Form.Label>New Ingredients</Form.Label>
                        <Form.Control onChange={e => setNewIngredientName(e.target.value)}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => changeIngredientForEntry()}>Change</Button>
                    <Button onClick={() => setChangeIngredient({ change: false, id: '0' })}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Entries;