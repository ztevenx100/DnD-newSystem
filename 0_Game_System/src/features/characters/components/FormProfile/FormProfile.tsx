import React from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { CHARACTER_CLASSES, CHARACTER_RACES, CHARACTER_JOBS, CHARACTER_KNOWLEDGE } from '../../../../components/pages/UserCharacters/CharacterSheet/constants';
import FormImageFile from '../../../../components/pages/UserCharacters/CharacterSheet/FormImageFile/FormImageFile';
import SvgCharacter from "@Icons/SvgCharacter";

interface FormProfileProps {
  userName: string;
  name: string;
  characterClass: string;
  race: string;
  job: string;
  level: number;
  luckyPoints: number;
  lifePoints: number;
  description: string;
  knowledge: string[];
  imageUrl?: string;
  onNameChange: (name: string) => void;
  onClassChange: (characterClass: string) => void;
  onRaceChange: (race: string) => void;
  onJobChange: (job: string) => void;
  onLevelChange: (level: number) => void;
  onLuckyPointsChange: (points: number) => void;
  onLifePointsChange: (points: number) => void;
  onDescriptionChange: (description: string) => void;
  onKnowledgeChange: (knowledge: string[]) => void;
  onImageChange: (url: string, file: File) => void;
  disabled?: boolean;
}

const FormProfile: React.FC<FormProfileProps> = ({
  userName,
  name,
  characterClass,
  race,
  job,
  level,
  luckyPoints,
  lifePoints,
  description,
  knowledge,
  imageUrl,
  onNameChange,
  onClassChange,
  onRaceChange,
  onJobChange,
  onLevelChange,
  onLuckyPointsChange,
  onLifePointsChange,
  onDescriptionChange,
  onKnowledgeChange,
  onImageChange,
  disabled = false
}) => {
  return (
    <fieldset className="fieldset-form info-player col-span-2 md:col-span-2 lg:col-span-3 bg-white shadow-lg rounded">
      <legend>
        <SvgCharacter width={20} height={20} className="inline" />
        Información del jugador
      </legend>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Basic Info Column */}
        <div className="col-span-1 md:col-span-2">
          <div className="mb-4">
            <label htmlFor="userName" className="form-lbl bg-grey-lighter">
              Jugador
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              className="form-input"
              readOnly
              disabled
            />
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="form-lbl bg-grey-lighter">
              Personaje
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => onNameChange(e.target.value)}
              placeholder="Nombre del personaje"
              className="form-input"
              maxLength={50}
              disabled={disabled}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="characterClass" className="form-lbl bg-grey-lighter">
              Clase
            </label>
            <Select
              id="characterClass"
              selectedKeys={characterClass ? [characterClass] : []}
              onChange={e => onClassChange(e.target.value)}
              className="form-input"
              isDisabled={disabled}
            >
              {CHARACTER_CLASSES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.name}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="mb-4">
            <label htmlFor="race" className="form-lbl bg-grey-lighter">
              Raza
            </label>
            <Select
              id="race"
              selectedKeys={race ? [race] : []}
              onChange={e => onRaceChange(e.target.value)}
              className="form-input"
              isDisabled={disabled}
            >
              {CHARACTER_RACES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.name}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="mb-4">
            <label htmlFor="job" className="form-lbl bg-grey-lighter">
              Trabajo
            </label>
            <Select
              id="job"
              selectedKeys={job ? [job] : []}
              onChange={e => onJobChange(e.target.value)}
              className="form-input"
              isDisabled={disabled}
            >
              {CHARACTER_JOBS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        {/* Stats Column */}
        <div className="col-span-1">
          <div className="mb-4">
            <label htmlFor="level" className="form-lbl bg-grey-lighter">
              Nivel
            </label>
            <input
              type="number"
              id="level"
              value={level}
              onChange={e => onLevelChange(parseInt(e.target.value) || 1)}
              min={1}
              max={10}
              className="form-input"
              disabled={disabled}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="luckyPoints" className="form-lbl bg-grey-lighter">
              Puntos de suerte
            </label>
            <input
              type="number"
              id="luckyPoints"
              value={luckyPoints}
              onChange={e => onLuckyPointsChange(parseInt(e.target.value) || 0)}
              min={0}
              max={10}
              className="form-input"
              disabled={disabled}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="lifePoints" className="form-lbl bg-grey-lighter">
              Vida
            </label>
            <input
              type="number"
              id="lifePoints"
              value={lifePoints}
              onChange={e => onLifePointsChange(parseInt(e.target.value) || 1)}
              min={1}
              max={10}
              className="form-input"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Image Column */}
        <div className="col-span-1">
          <label htmlFor="characterImage" className="form-lbl bg-grey-lighter">
            Imagen
          </label>
          <FormImageFile
            externalStyles="w-full h-48 object-cover"
            locationImage={imageUrl}
            onFormImageFileChange={onImageChange}
          />
        </div>
      </div>

      {/* Description and Knowledge */}
      <div className="mt-4">
        <label htmlFor="description" className="form-lbl bg-grey-lighter">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
          placeholder="Descripción del personaje"
          className="form-input w-full"
          rows={3}
          maxLength={500}
          disabled={disabled}
        />
      </div>

      <div className="mt-4">
        <label className="form-lbl bg-grey-lighter">Conocimientos</label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {CHARACTER_KNOWLEDGE.map((option) => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={knowledge.includes(option.value)}
                onChange={(e) => {
                  const newKnowledge = e.target.checked
                    ? [...knowledge, option.value]
                    : knowledge.filter(k => k !== option.value);
                  onKnowledgeChange(newKnowledge);
                }}
                disabled={disabled}
              />
              <span>{option.name}</span>
            </label>
          ))}
        </div>
      </div>
    </fieldset>
  );
};

export default FormProfile;