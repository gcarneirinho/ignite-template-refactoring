import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

const Dashboard: React.FC = () => {

  const [ foods, setFoods ] = useState<any>([]);
  const [ editingFood, setEditingFood ] = useState<FoodProps>();
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ editModalOpen, setEditModalOpen ] = useState(false);
  
  useEffect(() => {
    const getFoods = async() => {
      const response = await api.get('/foods');

      setFoods(response.data);
    }

    getFoods();
  },[])


  const handleAddFood = async (food:FoodProps) => {

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food:FoodProps) => {

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood?.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map((f:FoodProps) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
      setEditModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id:number) => {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food:FoodProps) => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = ():void => {
    setModalOpen(!modalOpen);
  }

  const toggleEditModal = ():void => {
    setModalOpen(!editModalOpen);
  }

  const handleEditFood = (food:FoodProps):void => {
    setEditingFood(food);
    setEditModalOpen(true);
  }

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map((food:FoodProps) => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
};

export default Dashboard;
