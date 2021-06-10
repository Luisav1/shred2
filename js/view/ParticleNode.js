// Copyright 2014-2020, University of Colorado Boulder

/**
 * Particle, represented as a circle with a gradient.  This type does not
 * track a particle, use ParticleView for that.
 */

import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Node from '../../../scenery/js/nodes/Node.js';
import RadialGradient from '../../../scenery/js/util/RadialGradient.js';
import Tandem from '../../../tandem/js/Tandem.js';
import shred from '../shred.js';
import Property from '../../../axon/js/Property.js';
import Range from '../../../dot/js/Range.js';
import PropertyIO from '../../../axon/js/PropertyIO.js';
import NumberIO from '../../../tandem/js/types/NumberIO.js';

/**
 * @param {string} particleType - proton, neutron, or electron
 * @param {number} radius
 * @param {Object} [options]
 * @constructor
 */
function ParticleNode( particleType, radius, options ) {

  options = merge( {
    tandem: Tandem.OPTIONAL
  }, options );

  Node.call( this, options ); // Call super constructor.

  const colors = { proton: PhetColorScheme.RED_COLORBLIND, neutron: 'gray', electron: 'blue' };
  let baseColor = colors[ particleType ];
  if ( baseColor === undefined ) {
    assert && assert( false, 'Unrecognized particle type: ' + particleType );
    baseColor = 'black';
  }

  // Create the node a circle with a gradient.
  this.addChild( new Circle( radius, {
    fill: new RadialGradient( -radius * 0.4, -radius * 0.4, 0, -radius * 0.4, -radius * 0.4, radius * 1.6 )
      .addColorStop( 0, 'white' )
      .addColorStop( 1, baseColor ),
    cursor: 'pointer'
  } ) );

  this.zLayerProperty = new Property( 0, {
    isValidValue: function( value ) {
      return value >= 0 && value <= options.maxZLayer;
    },
    tandem: options.tandem && options.tandem.createTandem( 'zLayerProperty' ),
    numberType: 'Integer',
    range: new Range( 0, Number.POSITIVE_INFINITY ),
    phetioType: PropertyIO( NumberIO )
  } ); // Used in view, integer value, higher means further back.
}

shred.register( 'ParticleNode', ParticleNode );

// Inherit from Node.
inherit( Node, ParticleNode );
export default ParticleNode;