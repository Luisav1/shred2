// Copyright 2014-2015, University of Colorado Boulder

/**
 * Node that represents the electron shells, aka "orbits", in the view.
 *
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  // constants
  var LINE_DASH = [ 4, 5 ];

  /**
   * @param {ParticleAtom} atom
   * @param {ModelViewTransform2} mvt
   * @constructor
   */
  function ElectronShellView( atom, mvt ) {

    // Call super constructor.
    Node.call( this,
      {
        pickable: false
      }
    );

    var outerRing = new Circle( mvt.modelToViewDeltaX( atom.outerElectronShellRadius ),
      {
        stroke: 'blue',
        lineWidth: 1.5,
        lineDash: LINE_DASH,
        translation: mvt.modelToViewPosition( { x: 0, y: 0 } )
      }
    );
    this.addChild( outerRing );

    var innerRing = new Circle( mvt.modelToViewDeltaX( atom.innerElectronShellRadius ),
      {
        stroke: 'blue',
        lineWidth: 1.5,
        lineDash: LINE_DASH,
        translation: mvt.modelToViewPosition( { x: 0, y: 0 } )
      }
    );
    this.addChild( innerRing );
  }

  // Inherit from Node.
  return inherit( Node, ElectronShellView );
} );
