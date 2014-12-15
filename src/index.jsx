'use strict';

var React = require('react')

var CodeMirror = require('react-code-mirror')
require('codemirror/mode/javascript/javascript')

var previewKey = 1

/**
 * Allow {__html: '...'} to be provided for context variable documentation.
 * @param {string|Object} doc context variable documentation.
 */
function renderDoc(doc) {
  if (Object.prototype.hasOwn.call(doc, '__html')) {
    return <span dangerouslySetInnerHTML={doc}/>
  }
  return doc
}

var Playground = React.createClass({
  getDefaultProps() {
    return {
      leadText: 'Generate interactive playgrounds with React'
    , title: 'React Playground'
    , titleLink: 'https://github.com/insin/react-playground'
    }
  },

  getInitialState () {
    return {
      error: null
    , inputs: null
    , src: this.props.previewer.examples[0].src
    }
  },

  componentDidMount() {
    this.evalSrc()
  },

  onChange(e) {
    var src = e.target.value
    this.setState({error: null, src}, this.evalSrc)
  },

  onChangeExample(e) {
    var index = e.target.selectedIndex
    var src = this.props.previewer.examples[index].src
    this.setState({error: null, src}, this.evalSrc)
  },

  evalSrc() {
    try {
      var {src} = this.state
      var {context} = this.props.previewer
      var contextArgs = Object.keys(context)
      var contextValues = contextArgs.map(var_ => context[var_])
      var func = Function.apply(null, contextArgs.concat([src]))
      var result = func.apply(null, contextValues)
      previewKey++
      this.setState({input: result})
    }
    catch (err) {
      this.setState({error: err.message})
    }
  },

  render() {
    var {src, error, input} = this.state
    var {examples, contextDoc} = this.props.previewer
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
               {examples.map((example, index) => <option>
                 {index + 1}. {example.name}
               </option>)}
              </select>
            </div>
            <div className="form-group">
              <p><b>Context Variables</b></p>
              <ul>
                {Object.keys(contextDoc).map(var_ => <li>
                  <strong>{var_}</strong> &ndash; {renderDoc(contextDoc[var_])}
                </li>)}
              </ul>
            </div>
            <div className="form-group">
              <CodeMirror
                style={{border: '1px solid #F6E4CC'}}
                textAreaClassName={['form-control']}
                textAreaStyle={{minHeight: '10em'}}
                mode="javascript"
                theme="monokai"
                value={src}
                lineNumbers={false}
                lineWrapping={false}
                smartIndent={false}
                onChange={this.onChange}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          {error && <div>
            <h3>Error!</h3>
            <div className="alert alert-danger">{error}</div>
          </div>}
          <h3>Preview</h3>
          {input && <this.props.previewer key={previewKey} input={input}/>}
        </div>
      </div>
    </div>
  }
})

module.exports = Playground