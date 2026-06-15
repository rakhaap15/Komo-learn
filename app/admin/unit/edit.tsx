import {
  SimpleForm,
  Edit,
  TextInput,
  ReferenceInput,
  NumberInput,
  required,
  SelectInput,
} from "react-admin";

export const UnitEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <NumberInput
          source="id"
          label="Id"
          disabled
        />

        <TextInput
          source="title"
          validate={[required()]}
          label="Title"
        />

        <TextInput
          source="description"
          validate={[required()]}
          label="Description"
        />

        <ReferenceInput
          source="courseId"
          reference="courses"
        >
          <SelectInput optionText="title" />
        </ReferenceInput>

        <NumberInput
          source="order"
          validate={[required()]}
          label="Order"
        />
      </SimpleForm>
    </Edit>
  );
};