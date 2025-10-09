"use client";
import React, { useState, ReactNode } from "react";
import Styles from "./QuestionFormComponent.module.css";
import app_identity from "@/app/config/identity";

import { QuestionFormComponentProps, FieldType, btnCardProps } from "./QuestionFormComponent_Types";

import CheckBoxComponent from '@/app/components/global/InputsComponents/CheckBoxComponent/CheckBoxComponent';
import InputComponent from "@/app/components/global/InputsComponents/InputComponent/InputComponent";
import DropListComponent from "@/app/components/global/InputsComponents/DropListComponent/DropListComponent";

import { LuTrash2 } from "react-icons/lu";
import { FiEdit2 } from "react-icons/fi";
import { RxDragHandleDots1 } from "react-icons/rx";
import { GrList } from "react-icons/gr";


import { TbNumber123 } from "react-icons/tb";
import { MdTextFields, MdOutlineAddPhotoAlternate, MdEvent, MdDateRange, MdAccessTime } from "react-icons/md";
import { CgUserList } from "react-icons/cg";

import { BsChatRightText } from "react-icons/bs";
import { VscGithubAction } from "react-icons/vsc";
// import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { TfiPulse } from "react-icons/tfi";
import { FaMapLocationDot } from "react-icons/fa6";
import { PiSignatureDuotone } from "react-icons/pi";
import { SingleChoiceAnswer } from "../InputsComponents";

const MAX_CHECKBOX_OPTIONS_LIMIT = 25;

function QuestionFormComponent({
  index,
  title,
  fields,
  onSubmitNewType,
  onRemoveField,
  onRemoveQuestion,
  onUpdateTitle,
}: QuestionFormComponentProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [checkboxOptions, setCheckboxOptions] = useState<string[]>([]);
  const [mcqOptions, setMcqOptions] = useState<string[]>(["Yes", "No", "N/A"]);
  const [editingFieldId, setEditingFieldId] = useState<string | number | null>(null);

  const existingTypes = fields.map((f) => f.type);
  const sortedFields = [...fields].sort((a, b) => (a.type === "mcq" ? -1 : b.type === "mcq" ? 1 : 0));

  const renderField = (field: FieldType, i: number) => {
    const commonProps = {
      key: field.id,
      onRemove: () => onRemoveField(index, field.id),
      listLength: fields.length,
    };

    const map: { [key: string]: [string, ReactNode] } = {
      short_text: ["Short Text", <MdTextFields key="short_text" />],
      comment: ["Comment", <BsChatRightText key="comment" />],
      images: ["Images", <MdOutlineAddPhotoAlternate key="images" />],
      action: ["Action", <VscGithubAction key="action" />],
      time: ["Time", <MdAccessTime key="time" />],
      number: ["Number", <TbNumber123 key="number" />],
      date_time: ["Date & Time", <MdEvent key="date_time" />],
      // date_range: ["Date Range", <HiOutlineCalendarDateRange key="date_range" />],
      date: ["Date", <MdDateRange key="date" />],
      score: ["Score", <TfiPulse key="score" />],
      location: ["Location", <FaMapLocationDot key="Location"/>],
      signature: ["Signature", <PiSignatureDuotone key="Signature" />],
      checkbox: ["Checkbox", <GrList key="Checkbox"/>],
      assets_list: ["assets Checkbox List", <GrList key="all assets"/>],
      users_list: ["users Checkbox List", <CgUserList key="all assets"/>],
      mcq: ["MCQ", <BsChatRightText key="MCQ"/>],
    };

    const data = map[field.type];
    if (!data) return <p key={i}>Unsupported field type: {field.type}</p>;

    if (field.type === "checkbox" && field.options) {
      return (
        <div key={field.id} style={{ display: 'flex', flexDirection: 'column', position: "relative", width: '100%' }}>
          <h3>Choose</h3>
          {field.options.map((option, idx) => (
            <CheckBoxComponent key={idx} disable={true} label={option.label} />
          ))}
          {fields.length > 1 && (
            <div style={{ color: app_identity.secondary_color, display: 'flex', alignItems: 'center', gap: 10, position: 'absolute', right: 0 }}>
              <FiEdit2
                style={{ cursor: 'pointer', fontSize: '18px' }}
                onClick={() => {
                  setSelectedType("checkbox");
                  setEditingFieldId(field.id);
                  setCheckboxOptions(field.options?.map(opt => opt.label) || []);
                }}
              />
              <LuTrash2 style={{ cursor: 'pointer', fontSize: '18px' }} onClick={commonProps.onRemove} />
            </div>
          )}
        </div>
      );
    }

    if (field.type === "mcq" && field.options) {
      return (
        <div key={field.id} style={{ width: '100%', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <SingleChoiceAnswer
            options={field.options.map((opt) => ({ label: opt.label, value: String(opt.value) }))}
          />
          {fields.length > 1 && (
            <div style={{ color: app_identity.secondary_color, display: 'flex', alignItems: 'center', gap: 10 }}>
              <FiEdit2
                style={{ cursor: 'pointer', fontSize: '18px' }}
                onClick={() => {
                  setSelectedType("mcq");
                  setEditingFieldId(field.id);
                  setMcqOptions(field.options?.map(opt => opt.label) || []);
                }}
              />
              <LuTrash2 style={{ cursor: 'pointer', fontSize: '18px' }} onClick={commonProps.onRemove} />
            </div>
          )}
        </div>
      );
    }

    return <ButtonCard title={data[0]} icon={data[1]} {...commonProps} />;
  };

  const handleAddCheckboxOption = () => {
    if (checkboxOptions.length < MAX_CHECKBOX_OPTIONS_LIMIT) {
      setCheckboxOptions((prev) => [...prev, ""]);
    }
  };

  const handleCheckboxOptionChange = (value: string, i: number) => {
    setCheckboxOptions((prev) => {
      const updated = [...prev];
      updated[i] = value;
      return updated;
    });
  };

  const handleRemoveCheckboxOption = (i: number) => {
    setCheckboxOptions((prev) => prev.filter((_, idx) => idx !== i));
  };

  const canSubmitCheckbox =
    selectedType === "checkbox" &&
    checkboxOptions.length > 0 &&
    checkboxOptions.every((opt) => opt.trim() !== "");

  const canSubmitMCQ =
    selectedType === "mcq" &&
    mcqOptions.length > 0 &&
    mcqOptions.every((opt) => opt.trim() !== "");

  const isMCQAlreadyExist = fields.some((f) => f.type === "mcq" && f.id !== editingFieldId);

  return (
    <div style={{ position: "relative" }} className={Styles.questionBox}>
      <div>
        {onRemoveQuestion && (
          <div className={Styles.deleteQuestionBtn} onClick={onRemoveQuestion}>×</div>
        )}
        <h3>Question {index + 1}:</h3>
      </div>

      <InputComponent
        isTextArea
        label=""
        placeholder="Please enter your Question"
        value={title}
        onTyping={(val) => onUpdateTitle(index, val)}
      />

      <section style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        {sortedFields.map(renderField)}
      </section>

      <section className={Styles.actionsRow}>
        <DropListComponent
          label="Other responses"
          placeholder="Choose Other responses"
          onSelect={(val) => {
            const value = val?.value || null;
            if (value === "mcq" && isMCQAlreadyExist) return;
            setSelectedType(value);
            if (value === "mcq") {
              setMcqOptions(["Yes", "No", "N/A"]);
            }
          }}
          list={[
            { id: 1, value: "short_text", title: "short text" },
            { id: 2, value: "number", title: "number" },
            { id: 3, value: "comment", title: "comment" },
            { id: 4, value: "checkbox", title: "Checkbox" },
            { id: 5, value: "users_list", title: "users Checkbox List" },
            { id: 6, value: "assets_list", title: "assets Checkbox List" },
            { id: 7, value: "mcq", title: "MCQ" },
            { id: 8, value: "action", title: "action" },
            { id: 9, value: "images", title: "images" },
            { id: 10, value: "date", title: "date" },
            { id: 11, value: "time", title: "time" },
            { id: 12, value: "date_time", title: "date time" },
            // { id: 8, value: "date_range", title: "date range" },
            { id: 13, value: "location", title: "location" },
            { id: 14, value: "signature", title: "signature" },
            { id: 15, value: "score", title: "score" },
          ]}
        />

        {selectedType === "checkbox" && checkboxOptions.length < MAX_CHECKBOX_OPTIONS_LIMIT && (
          <button type="button" onClick={handleAddCheckboxOption} className={Styles.addOptionBtn}>+</button>
        )}

          <button
            type="button"
            onClick={() => {
              if (selectedType === "checkbox") {
                if (!canSubmitCheckbox) return;
                const newField: FieldType = {
                  id: editingFieldId ?? Date.now(),
                  type: "checkbox",
                  options: checkboxOptions.map((opt, i) => ({ id: i, label: opt, value: opt })),
                };
                if (editingFieldId) onRemoveField(index, editingFieldId);
                onSubmitNewType(index, newField);
              } else if (selectedType === "mcq") {
                if (!canSubmitMCQ) return;
                const newField: FieldType = {
                  id: editingFieldId ?? Date.now(),
                  type: "mcq",
                  options: mcqOptions.map((opt, i) => ({ id: i, label: opt, value: i === 0 ? "1" : i === 1 ? "0" : "-1" })),
                };
                if (editingFieldId) onRemoveField(index, editingFieldId);
                onSubmitNewType(index, newField);
              } else if (selectedType && !existingTypes.includes(selectedType)) {
                onSubmitNewType(index, { id: Date.now(), type: selectedType });
              }

              setSelectedType(null);
              setCheckboxOptions([]);
              setMcqOptions(["Yes", "No", "N/A"]);
              setEditingFieldId(null);
            }}
            className={Styles.submitBtn}
            disabled={
              (selectedType === "checkbox" && !canSubmitCheckbox) ||
              (selectedType === "mcq" && !canSubmitMCQ)
            }
          >
            Submit
          </button>
      </section>

      {selectedType === "checkbox" && (
        <div style={{ marginTop: 20 }}>
          {checkboxOptions.map((opt, i) => (
            <div key={i} className={Styles.checkboxOptionWrapper}>
              <InputComponent
                label={`Option ${i + 1}`}
                value={opt}
                onTyping={(val) => handleCheckboxOptionChange(val, i)}
                placeholder="Enter checkbox option"
              />
              <div className={Styles.deleteBtn} onClick={() => handleRemoveCheckboxOption(i)}>×</div>
            </div>
          ))}
        </div>
      )}

      {selectedType === "users_list" && (
        <div style={{ marginTop: 20 }}>
          {checkboxOptions.map((opt, i) => (
            <div key={i} className={Styles.checkboxOptionWrapper}>
              <InputComponent
                label={`Option ${i + 1}`}
                value={opt}
                onTyping={(val) => handleCheckboxOptionChange(val, i)}
                placeholder="Enter checkbox option"
              />
              <div className={Styles.deleteBtn} onClick={() => handleRemoveCheckboxOption(i)}>×</div>
            </div>
          ))}
        </div>
      )}
      {selectedType === "assets_list" && (
        <div style={{ marginTop: 20 }}>
          {checkboxOptions.map((opt, i) => (
            <div key={i} className={Styles.checkboxOptionWrapper}>
              <InputComponent
                label={`Option ${i + 1}`}
                value={opt}
                onTyping={(val) => handleCheckboxOptionChange(val, i)}
                placeholder="Enter checkbox option"
              />
              <div className={Styles.deleteBtn} onClick={() => handleRemoveCheckboxOption(i)}>×</div>
            </div>
          ))}
        </div>
      )}

      {selectedType === "mcq" && (
        <div style={{ marginTop: 20 }}>
          {mcqOptions.map((opt, i) => (
            <div key={i} className={Styles.MCQOptionWrapper}>
              <InputComponent
                label={`Option ${i + 1}`}
                value={String(opt)}
                onTyping={(val) => {
                  const updated = [...mcqOptions];
                  updated[i] = val;
                  setMcqOptions(updated);
                }}
                placeholder={i == 0 ?"Enter 'Yes' option":i == 1 ?"Enter 'NO' option":"Enter 'N/A' option"}
              />
              <RxDragHandleDots1
                style={{
                  color:i == 0 ?'rgba(104, 166, 166, 1)'
                    :i == 1 ?'rgba(229, 21, 25, 1)'
                    :'rgba(238, 201, 12, 1)',
                  fontSize:58,
                  marginTop: 15,
                  marginLeft: -10,
                  opacity: 0.7,
                }}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuestionFormComponent;

function ButtonCard({ title, icon, listLength, onRemove }: btnCardProps) {
  return (
    <div className={Styles.ButtonCard}>
      <span>{icon}</span>
      <span>{title}</span>
      {listLength !== 1 && <div onClick={onRemove}>×</div>}
    </div>
  );
}
