import { render, fireEvent, screen } from '@testing-library/react';
import { FormInventory, FormProfile, FormSkills, FormStats, FormWeapons } from '..';

describe('Character Form Components', () => {
  describe('FormStats', () => {
    const mockStats = [
      {
        id: "STR",
        label: "Fuerza",
        description: "Test description",
        valueDice: 5,
        valueClass: 2,
        valueLevel: 1
      }
    ];

    it('renders all stat inputs', () => {
      const mockOnChange = jest.fn();
      render(<FormStats stats={mockStats} onStatsChange={mockOnChange} />);
      
      expect(screen.getByLabelText('Fuerza')).toBeInTheDocument();
      expect(screen.getByDisplayValue('5')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    });

    it('calls onStatsChange when stats are updated', () => {
      const mockOnChange = jest.fn();
      render(<FormStats stats={mockStats} onStatsChange={mockOnChange} />);
      
      const input = screen.getByDisplayValue('5');
      fireEvent.change(input, { target: { value: '6' } });
      
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('FormInventory', () => {
    const mockInventory = [
      {
        id: "1",
        name: "Sword",
        description: "A sharp sword",
        count: 1,
        readOnly: false
      }
    ];
    const mockCoins = [10, 5, 2];

    it('renders inventory items', () => {
      const mockOnChange = jest.fn();
      const mockOnCoinsChange = jest.fn();
      const mockOnDelete = jest.fn();

      render(
        <FormInventory 
          inventory={mockInventory}
          coins={mockCoins}
          onInventoryChange={mockOnChange}
          onCoinsChange={mockOnCoinsChange}
          onDeleteItem={mockOnDelete}
        />
      );
      
      expect(screen.getByText('Sword')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    });

    it('allows adding new items', () => {
      const mockOnChange = jest.fn();
      const mockOnCoinsChange = jest.fn();
      const mockOnDelete = jest.fn();

      render(
        <FormInventory 
          inventory={mockInventory}
          coins={mockCoins}
          onInventoryChange={mockOnChange}
          onCoinsChange={mockOnCoinsChange}
          onDeleteItem={mockOnDelete}
        />
      );
      
      const nameInput = screen.getByPlaceholderText('Objeto');
      const addButton = screen.getByText('Añadir');

      fireEvent.change(nameInput, { target: { value: 'New Item' } });
      fireEvent.click(addButton);

      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('FormProfile', () => {
    const defaultProps = {
      userName: "TestUser",
      name: "TestChar",
      characterClass: "WAR",
      race: "HUM",
      job: "HUN",
      level: 1,
      luckyPoints: 3,
      lifePoints: 10,
      description: "Test description",
      knowledge: ["HIS"],
      onNameChange: jest.fn(),
      onClassChange: jest.fn(),
      onRaceChange: jest.fn(),
      onJobChange: jest.fn(),
      onLevelChange: jest.fn(),
      onLuckyPointsChange: jest.fn(),
      onLifePointsChange: jest.fn(),
      onDescriptionChange: jest.fn(),
      onKnowledgeChange: jest.fn(),
      onImageChange: jest.fn()
    };

    it('renders character info fields', () => {
      render(<FormProfile {...defaultProps} />);
      
      expect(screen.getByDisplayValue('TestUser')).toBeInTheDocument();
      expect(screen.getByDisplayValue('TestChar')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
    });

    it('handles input changes', () => {
      render(<FormProfile {...defaultProps} />);
      
      const nameInput = screen.getByDisplayValue('TestChar');
      fireEvent.change(nameInput, { target: { value: 'New Name' } });
      
      expect(defaultProps.onNameChange).toHaveBeenCalledWith('New Name');
    });
  });

  describe('FormSkills', () => {
    const defaultProps = {
      level: 5,
      alignment: "O",
      skillsAcquired: [
        { id: "1", value: "0", name: "Skill1", description: "", ring: "STR" }
      ],
      skillsRingList: [{ id: "0", skills: [] }],
      skillList: [{ value: "skill1", name: "Skill 1" }],
      onSkillsChange: jest.fn(),
      onAlignmentChange: jest.fn()
    };

    it('renders alignment selector when level >= 3', () => {
      render(<FormSkills {...defaultProps} />);
      expect(screen.getByDisplayValue('O')).toBeInTheDocument();
    });

    it('handles alignment changes', () => {
      render(<FormSkills {...defaultProps} />);
      
      const alignmentSelect = screen.getByDisplayValue('O');
      fireEvent.change(alignmentSelect, { target: { value: 'C' } });
      
      expect(defaultProps.onAlignmentChange).toHaveBeenCalledWith('C');
    });
  });

  describe('FormWeapons', () => {
    const defaultProps = {
      mainWeapon: "Sword",
      secondaryWeapon: "Shield",
      mainSkill: "skill1",
      extraSkill: "skill2",
      skillOptions: [
        { value: "skill1", name: "Skill 1" },
        { value: "skill2", name: "Skill 2" }
      ],
      onMainWeaponChange: jest.fn(),
      onSecondaryWeaponChange: jest.fn(),
      onMainSkillChange: jest.fn(),
      onExtraSkillChange: jest.fn()
    };

    it('renders weapon inputs', () => {
      render(<FormWeapons {...defaultProps} />);
      
      expect(screen.getByDisplayValue('Sword')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Shield')).toBeInTheDocument();
    });

    it('handles weapon changes', () => {
      render(<FormWeapons {...defaultProps} />);
      
      const mainWeaponInput = screen.getByDisplayValue('Sword');
      fireEvent.change(mainWeaponInput, { target: { value: 'New Sword' } });
      
      expect(defaultProps.onMainWeaponChange).toHaveBeenCalledWith('New Sword');
    });
  });
});