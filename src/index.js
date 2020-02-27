import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const FILTERS = ["All", "Active", "Completed"];

class AddNewItemInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.value.trim()) {
      this.props.onNewItemInputSubmit(this.state.value);

      this.setState({ value: "" });
      event.target.reset();
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          defaultValue={this.state.value}
          onChange={this.handleChange}
          className="new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <AddNewItemInput
          onNewItemInputSubmit={this.props.onNewItemInputSubmit}
        />
      </header>
    );
  }
}

class MarkItemsAsCompleted extends React.Component {
  constructor(props) {
    super(props);

    this.onToggle = this.onToggle.bind(this);
  }

  onToggle() {
    this.props.onToggleAllClicked(
      !(
        this.props.items.length ===
        this.props.items.filter(item => item.completed).length
      )
    );
  }

  render() {
    let shouldBeToggled =
      this.props.items.length ===
        this.props.items.filter(item => item.completed).length &&
      this.props.items.length;

    return (
      <div>
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={this.onToggle}
          checked={shouldBeToggled}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
      </div>
    );
  }
}

class ListItems extends React.Component {
  constructor(props) {
    super(props);

    this.removeListItem = this.removeListItem.bind(this);
    this.toggleListItem = this.toggleListItem.bind(this);
    this.labelMakeEditable = this.labelMakeEditable.bind(this);
    this.labelEditted = this.labelEditted.bind(this);
    this.handleLabelChange = this.handleLabelChange.bind(this);
  }

  removeListItem(event) {
    this.props.onRemoveButtonClick(event.target.dataset.nodeid);
  }

  toggleListItem(event) {
    this.props.onCheckboxToggle(event.target.dataset.nodeid);
  }

  labelMakeEditable(event) {
    event.target.contentEditable = true;
    event.target.focus();
    document
      .getSelection()
      .setBaseAndExtent(
        event.target,
        event.target.childNodes.length,
        event.target,
        event.target.childNodes.length
      );
  }

  labelEditted(event) {
    event.target.contentEditable = false;
    this.props.onLabelEdit(event.target.dataset.nodeid, event.target.innerText);
  }

  handleLabelChange(event) {
    if (event.keyCode === 13) {
      this.labelEditted(event);
    }
  }

  render() {
    const toDoItems = [];
    this.props.items.forEach(item => {
      let hidden = false;
      if (this.props.activeFilter === "Active") {
        hidden = item.completed ? true : false;
      }
      if (this.props.activeFilter === "Completed") {
        hidden = item.completed ? false : true;
      }

      toDoItems.push(
        <li
          className={item.completed ? "completed" : ""}
          hidden={hidden}
          key={item.id}
        >
          <div className="view">
            <input
              className="toggle"
              data-nodeid={item.id}
              checked={item.completed}
              type="checkbox"
              onChange={this.toggleListItem}
            />
            <label
              data-nodeid={item.id}
              onDoubleClick={this.labelMakeEditable}
              onBlur={this.labelEditted}
              onKeyDown={this.handleLabelChange}
            >
              {item.name}
            </label>
            <button
              data-nodeid={item.id}
              className="destroy"
              onClick={this.removeListItem}
            />
          </div>
        </li>
      );
    });

    return <ul className="todo-list">{toDoItems}</ul>;
  }
}

class MainSection extends React.Component {
  render() {
    return (
      <section className="main">
        <MarkItemsAsCompleted
          items={this.props.items}
          onToggleAllClicked={this.props.onToggleAllClicked}
        />
        <ListItems
          onRemoveButtonClick={this.props.onRemoveButtonClick}
          onCheckboxToggle={this.props.onCheckboxToggle}
          onLabelEdit={this.props.onLabelEdit}
          items={this.props.items}
          activeFilter={this.props.activeFilter}
        />
      </section>
    );
  }
}

class ToDoCount extends React.Component {
  render() {
    const activeItemsCount = this.props.todos.filter(item => !item.completed)
      .length;

    let counterElement =
      activeItemsCount === 1 ? (
        <span className="todo-count">
          <strong>{activeItemsCount}</strong> item left
        </span>
      ) : (
        <span className="todo-count">
          <strong>{activeItemsCount}</strong> items left
        </span>
      );

    return counterElement;
  }
}

class FilterList extends React.Component {
  constructor(props) {
    super(props);

    this.onFilterClick = this.onFilterClick.bind(this);
  }

  onFilterClick(event) {
    event.preventDefault();
    this.props.onActiveFilterChange(event.target.dataset.value);
  }

  render() {
    const filters = [];
    this.props.filters.forEach(filter =>
      filters.push(
        <li key={filter}>
          <a
            href={filter.toLowerCase() === "all" ? "" : filter.toLowerCase()}
            className={filter === this.props.activeFilter ? "selected" : ""}
            onClick={this.onFilterClick}
            data-value={filter}
          >
            {filter}
          </a>
        </li>
      )
    );
    return <ul className="filters">{filters}</ul>;
  }
}

class ClearCompletedButton extends React.Component {
  constructor(props) {
    super(props);

    this.buttonClick = this.buttonClick.bind(this);
  }

  buttonClick() {
    this.props.onClearCompleted();
  }

  render() {
    return (
      <button className="clear-completed" onClick={this.buttonClick}>
        Clear completed
      </button>
    );
  }
}

class Footer extends React.Component {
  render() {
    let containsCompletedItems = this.props.items.find(item => item.completed);

    return (
      <footer className="footer">
        <ToDoCount todos={this.props.items} />
        <FilterList
          filters={FILTERS}
          activeFilter={this.props.activeFilter}
          onActiveFilterChange={this.props.onActiveFilterChange}
        />
        {containsCompletedItems && (
          <ClearCompletedButton
            onClearCompleted={this.props.onClearCompleted}
          />
        )}
      </footer>
    );
  }
}

class ToDoApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [
        { name: "Todo 1", id: 0, completed: false },
        { name: "Todo 2", id: 1, completed: true },
        { name: "Todo 3", id: 2, completed: false }
      ],
      activeFilter: "All"
    };

    this.onNewItemInputSubmit = this.onNewItemInputSubmit.bind(this);
    this.onRemoveButtonClick = this.onRemoveButtonClick.bind(this);
    this.onCheckboxToggle = this.onCheckboxToggle.bind(this);
    this.onActiveFilterChange = this.onActiveFilterChange.bind(this);
    this.onClearCompleted = this.onClearCompleted.bind(this);
    this.onToggleAllClicked = this.onToggleAllClicked.bind(this);
    this.onLabelEdit = this.onLabelEdit.bind(this);
  }

  onNewItemInputSubmit(value) {
    let updatedTodos = this.state.todos.slice();
    updatedTodos.push({
      name: value,
      id:
        updatedTodos.length > 0
          ? updatedTodos[updatedTodos.length - 1].id + 1
          : 0,
      completed: false
    });
    this.setState({
      todos: updatedTodos
    });
  }

  onRemoveButtonClick(value) {
    let updatedTodos = this.state.todos
      .slice()
      .filter(item => item.id !== +value);
    this.setState({
      todos: updatedTodos
    });
  }

  onCheckboxToggle(value) {
    let updatedTodos = this.state.todos.slice();
    let updatedTodoIndex = updatedTodos.findIndex(item => item.id === +value);
    updatedTodos[updatedTodoIndex].completed = !updatedTodos[updatedTodoIndex]
      .completed;
    this.setState({
      todos: updatedTodos
    });
  }

  onActiveFilterChange(value) {
    this.setState({
      activeFilter: value
    });
  }

  onClearCompleted() {
    let updatedTodos = this.state.todos.slice().filter(item => !item.completed);

    this.setState({
      todos: updatedTodos
    });
  }

  onToggleAllClicked(isToggled) {
    let updatedTodos = isToggled
      ? this.state.todos.slice().map(item => ({
          ...item,
          completed: true
        }))
      : this.state.todos.slice().map(item => ({
          ...item,
          completed: false
        }));

    this.setState({
      todos: updatedTodos
    });
  }

  onLabelEdit(index, value) {
    let updatedTodoIndex = this.state.todos.findIndex(
      item => item.id === +index
    );

    let updatedTodos = this.state.todos.slice();
    updatedTodos[updatedTodoIndex].name = value;

    this.setState({
      todos: updatedTodos
    });
  }

  render() {
    const footerVisible = !!this.state.todos.length;

    return (
      <section className="todoapp">
        <Header onNewItemInputSubmit={this.onNewItemInputSubmit} />
        <MainSection
          onRemoveButtonClick={this.onRemoveButtonClick}
          onCheckboxToggle={this.onCheckboxToggle}
          onToggleAllClicked={this.onToggleAllClicked}
          onLabelEdit={this.onLabelEdit}
          items={this.state.todos}
          activeFilter={this.state.activeFilter}
        />
        {footerVisible && (
          <Footer
            items={this.state.todos}
            activeFilter={this.state.activeFilter}
            onActiveFilterChange={this.onActiveFilterChange}
            onClearCompleted={this.onClearCompleted}
          />
        )}
      </section>
    );
  }
}

const rootElement = document.getElementById("root");

ReactDOM.render(<ToDoApp />, rootElement);
