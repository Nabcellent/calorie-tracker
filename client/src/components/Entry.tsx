import React, { Dispatch, SetStateAction } from 'react';
import { Button, Card, Col, Row } from "react-bootstrap";
import { EntryType } from "./Entries";

type EntryProps = {
    entry: EntryType
    setChangeIngredient: Dispatch<SetStateAction<{ change: boolean; id: string; }>>
    setChangeEntry: Dispatch<SetStateAction<{ change: boolean; id: string; }>>
    deleteEntry: (id?: string) => void
}
const Entry = ({ entry, setChangeIngredient, deleteEntry, setChangeEntry }: EntryProps) => {
    const changeEntry = () => {
        setChangeEntry({ change: true, id: entry.id ?? '0' })
    }
    const changeIngredient = () => {
        setChangeIngredient({ change: true, id: entry.id ?? '0' })
    }

    return (
        <Card>
            {entry !== undefined && (
                <Row>
                    <Col>Dish: {entry.dish}</Col>
                    <Col>Ingredients: {entry.ingredients}</Col>
                    <Col>Calories: {entry.calories}</Col>
                    <Col>Fat: {entry.fat}</Col>
                    <Col><Button onClick={() => changeIngredient()}>Change Ingredient</Button></Col>
                    <Col><Button onClick={() => changeEntry()}>Change Entry</Button></Col>
                    <Col><Button onClick={() => deleteEntry(entry.id)}>Delete</Button></Col>
                </Row>
            )}
        </Card>
    );
};

export default Entry;