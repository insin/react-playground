'use strict';

var React = require('react')

var CodeMirror = require('react-code-mirror')
require('codemirror/mode/javascript/javascript')

var previewKey = 1

var Playground = React.createClass({
  getDefaultProps: function() {
    return {
      leadText: 'Generate interactive playgrounds with React'
    , title: 'React Playground'
    , titleLink: 'https://github.com/insin/react-playground'
    }
  },

  getInitialState: function () {
    return {
      error: null
    , inputs: null
    , src: this.props.previewer.examples[0].src
    }
  },

  componentDidMount: function() {
    this.evalSrc()
  },

  onChange: function(e) {
    var src = e.target.value
    this.setState({error: null, src: src}, this.evalSrc)
  },

  onChangeExample: function(e) {
    var index = e.target.selectedIndex
    this.setState({error: null, src: this.props.previewer.examples[index].src}, this.evalSrc)
  },

  evalSrc: function() {
    try {
      var src = this.state.src
      var context = this.props.previewer.context
      var contextArgs = Object.keys(context)
      var contextValues = contextArgs.map(function(var_) { return context[var_] })
      var func = Function.apply(null, contextArgs.concat([src]))
      var result = func.apply(null, contextValues)
      previewKey++
      this.setState({input: result})
    }
    catch (err) {
      this.setState({error: err.message})
    }
  },

  render: function() {
    var examples = this.props.previewer.examples
    var contextDoc = this.props.previewer.contextDoc
    return <div className="container">
      <div className="row header">
        <div className="col-md-12">
          <h1><a href={this.props.titleLink}>{this.props.title}</a></h1>
          <p className="lead">{this.props.leadText}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <h3>Source</h3>
          <p className="text-muted">Live code editor. Changes will be reflected in the preview to the right.</p>
          <div>
            <div className="form-group">
             <p><b>Examples</b></p>
             <select className="form-control" onChange={this.onChangeExample}>
               {examples.map(function(example, index) {
                 return <option>{index + 1}. {example.name}</option>
               })}
              </select>
            </div>
            <div className="form-group">
              <p><b>Context Variables</b></p>
              <ul>
                {Object.keys(contextDoc).map(function(contextVar) {
                  return <li><b>{contextVar}</b> &ndash; {contextDoc[contextVar]}</li>
                })}
              </ul>
            </div>
            <div className="form-group">
              <CodeMirror
                style={{border: '1px solid #F6E4CC'}}
                textAreaClassName={['form-control']}
                textAreaStyle={{minHeight: '10em'}}
                mode="javascript"
                theme="monokai"
                value={this.state.src}
                lineNumbers={false}
                lineWrapping={false}
                smartIndent={false}
                onChange={this.onChange}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          {this.state.error && <div>
            <h3>Error!</h3>
            <div className="alert alert-danger">{this.state.error}</div>
          </div>}
          <h3>Preview</h3>
          {this.state.input && <this.props.previewer key={previewKey} input={this.state.input}/>}
        </div>
      </div>
    </div>
  }
})

module.exports = Playground