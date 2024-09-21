import React, { useState, useEffect } from 'react';
import { getLists, createList } from './databaseServices';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ListManagementModal from './listmanagementmodal';

interface DashboardProps {
  userId: string;
}

interface List {
  id: string;
  title: string;
  rank: number; // New field
}

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [lists, setLists] = useState<List[]>([]);
  const [currentListIndex, setCurrentListIndex] = useState(0);
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  useEffect(() => {
    fetchLists();
  }, [userId]);

  const fetchLists = async () => {
    try {
      let fetchedLists = await getLists(userId);
      if (fetchedLists.length === 0) {
        const newListId = await createList(userId, "New List");
        fetchedLists = await getLists(userId); // Fetch again to get the new list with rank
      }
      setLists(fetchedLists);
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const handlePrevList = () => {
    setCurrentListIndex((prevIndex) => prevIndex - 1);
  };

  const handleNextList = () => {
    setCurrentListIndex((prevIndex) => prevIndex + 1);
  };

  const handleOpenListModal = () => {
    setIsListModalOpen(true);
  };

  const handleCloseListModal = () => {
    setIsListModalOpen(false);
    fetchLists(); // Refresh lists after closing modal
  };

  const showPrevButton = currentListIndex > 0;
  const showNextButton = currentListIndex < lists.length - 1;

  return (
    <div className="dashboard">
      <div className="list-carousel">
        {showPrevButton && (
          <button onClick={handlePrevList} className="carousel-button">
            <ChevronLeft size={24} />
          </button>
        )}
        {lists.length > 0 ? (
          <div className="list-name" onClick={handleOpenListModal}>
            <h2>{lists[currentListIndex].title}</h2>
          </div>
        ) : (
          <div className="list-name">
            <h2>No Lists</h2>
          </div>
        )}
        {showNextButton && (
          <button onClick={handleNextList} className="carousel-button">
            <ChevronRight size={24} />
          </button>
        )}
      </div>
      {lists.length > 0 && (
        <div className="current-list">
          {/* You can add functionality to display list content here */}
        </div>
      )}
      <ListManagementModal
        isOpen={isListModalOpen}
        onClose={handleCloseListModal}
        userId={userId}
        lists={lists}
        setLists={setLists}
        currentListIndex={currentListIndex}
      />
    </div>
  );
};

export default Dashboard;